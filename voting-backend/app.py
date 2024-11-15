import os
import redis
from flask import Flask, request, jsonify
import uuid
from datetime import datetime
from flask_cors import CORS


# Get Redis connection details from environment variables
REDIS_HOST = os.getenv("REDIS_HOST", "redis")  # Default to 'redis' (the name of the container)
REDIS_PORT = 6379
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)  # Optional, if needed

# Initialize Redis client
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD, decode_responses=True)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # This enables CORS for all routes by default

# Helper functions
def is_registered_voter(voter_id: str) -> bool:
    return redis_client.exists(f"voter:{voter_id}")

def is_registered_candidate(candidate_id: str) -> bool:
    return redis_client.exists(f"candidate:{candidate_id}")

def has_voted(voter_id: str) -> bool:
    return redis_client.exists(f"voted:{voter_id}")

def register_voter(voter_id: str, name: str):
    redis_client.hset(f"voter:{voter_id}", "name", name)
    print(f"Voter {voter_id} registered successfully.")

def register_candidate(candidate_id: str, name: str):
    redis_client.hset(f"candidate:{candidate_id}", "name", name)
    print(f"Candidate {candidate_id} registered successfully.")

def cast_vote(voter_id: str, candidate_id: str):
    # Record the vote by adding the voter_id to the "votes" set along with candidate_id
    redis_client.sadd("votes", f"{voter_id}:{candidate_id}")
    # Store vote details for the candidate
    redis_client.hincrby(f"candidate:{candidate_id}:votes", "count", 1)
    return True

# Routes
@app.route('/register/voter', methods=['POST'])
def register_voter_route():
    data = request.get_json()
    voter_id = data.get('voter_id')
    name = data.get('name')

    if is_registered_voter(voter_id):
        return jsonify({"message": "Voter already registered."}), 400
    
    register_voter(voter_id, name)
    return jsonify({"message": f"Voter {voter_id} registered successfully."}), 201

@app.route('/register/candidate', methods=['POST'])
def register_candidate_route():
    data = request.get_json()
    candidate_id = data.get('candidate_id')
    name = data.get('name')

    if is_registered_candidate(candidate_id):
        return jsonify({"message": "Candidate already registered."}), 400
    
    register_candidate(candidate_id, name)
    return jsonify({"message": f"Candidate {candidate_id} registered successfully."}), 201

@app.route('/vote', methods=['POST'])
def cast_vote_route():
    try:
        data = request.get_json()
        voter_id = data.get('voter_id')
        candidate_id = data.get('candidate_id')

        if not is_registered_voter(voter_id):
            return jsonify({"message": "Voter not registered."}), 404
        
        if not is_registered_candidate(candidate_id):
            return jsonify({"message": "Candidate not registered."}), 404

        if redis_client.exists(f"voted:{voter_id}"):
            return jsonify({"message": "Voter has already voted."}), 400

        if cast_vote(voter_id, candidate_id):
            redis_client.set(f"voted:{voter_id}", "true")
            return jsonify({"message": f"Vote cast successfully for {candidate_id}."}), 201
        else:
            return jsonify({"message": "Failed to cast vote."}), 400

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@app.route('/results', methods=['GET'])
def get_results():
    vote_count = {}
    for vote in redis_client.smembers("votes"):
        voter_id, candidate_id = vote.split(":")
        if candidate_id in vote_count:
            vote_count[candidate_id] += 1
        else:
            vote_count[candidate_id] = 1
    
    if not vote_count:
        return jsonify({"message": "No votes cast yet."}), 404
    
    return jsonify(vote_count), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
