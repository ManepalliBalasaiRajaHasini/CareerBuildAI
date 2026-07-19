from flask import Flask, render_template, request, jsonify
from google import genai

app = Flask(__name__)

# ==========================================
# Gemini API Clients
# ==========================================

career_client = genai.Client(
    api_key="YOUR_API_KEY"
)

interview_client = genai.Client(
    api_key="YOUR_API_KEY"
)

# Gemini Model
MODEL_NAME = "gemini-flash-latest"

# ==========================================
# Home Page
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# Courses Page
# ==========================================

@app.route("/courses")
def courses():
    return render_template("courses.html")


# ==========================================
# Career Page
# ==========================================

@app.route("/career")
def career():
    return render_template("career.html")


# ==========================================
# Interview Page
# ==========================================

@app.route("/interview")
def interview():
    return render_template("interview.html")


# ==========================================
# Career AI
# ==========================================

@app.route("/ask_ai", methods=["POST"])
def ask_ai():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "answer": "No data received."
            }), 400

        question = data.get("question", "").strip()

        if question == "":
            return jsonify({
                "answer": "Please enter your question."
            }), 400

        prompt = f"""
You are CareerBuild AI.

Your job is to guide students about:

• Careers
• Education
• Programming
• AI
• Technology
• Jobs
• Placements
• Higher Studies

User Question:

{question}

Rules:

1. If the question is related to careers,
software, AI, education, jobs,
placements or interview preparation,
answer ONLY in this format:

🎯 Career Goal

📚 Recommended Courses

🛣️ Learning Roadmap

💻 Skills Required

💼 Job Roles

💰 Salary

🎤 Interview Questions

📖 Free Resources

✨ Tips

2. If the question is NOT related to careers
(for example:
What is CPU?
What is Alcohol?
Explain DBMS?)

Answer normally in simple English.

Do NOT include:

❌ Career Goal
❌ Salary
❌ Roadmap
❌ Interview Questions

for normal knowledge questions.

Keep the answer beginner friendly.

Use bullet points wherever possible.
"""

        response = career_client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        return jsonify({
            "answer": response.text
        })
    except Exception as e:

        print(e)

        error = str(e)

        if "429" in error:
            return jsonify({
                "answer": "⚠️ Gemini API quota exceeded. Please try again later."
            }), 429

        return jsonify({
            "answer": error
        }), 500


# ==========================================
# AI Mock Interview
# ==========================================

@app.route("/ask_interview", methods=["POST"])
def ask_interview():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "answer": "No data received."
            }), 400

        interview_type = data.get("type", "HR")
        question = data.get("question", "").strip()
        answer = data.get("answer", "").strip()

        # ==========================================
        # Generate Interview Question
        # ==========================================

        if answer == "":

            prompt = f"""
You are a professional {interview_type} interviewer.

Generate ONLY ONE interview question.

Rules:

- Ask ONLY one interview question.
- Do NOT give the answer.
- Do NOT give career advice.
- Do NOT recommend courses.
- Do NOT mention salary.
- Wait for the candidate's answer.
- Keep the question simple and beginner friendly.
"""

        # ==========================================
        # Evaluate Candidate Answer
        # ==========================================

        else:

            prompt = f"""
You are an AI Mock Interview Evaluator.

This is NOT a career guidance task.

Your ONLY job is to evaluate the candidate's interview answer.

Interview Type:
{interview_type}

Interview Question:
{question}

Candidate Answer:
{answer}

IMPORTANT RULES:

- Do NOT recommend careers.
- Do NOT recommend courses.
- Do NOT generate roadmap.
- Do NOT mention salary.
- Do NOT suggest job roles.
- Do NOT answer the candidate's text as a new question.

ONLY evaluate the answer.

Return ONLY in this format:

⭐ Overall Score: __/10

🗣 Communication: __/10

💻 Technical Knowledge: __/10

🧠 Problem Solving: __/10

😊 Confidence: __/10

✅ Strengths

❌ Weaknesses

💡 Better Sample Answer

🎯 Final Suggestion

Keep the evaluation professional,
positive,
and beginner friendly.
"""

        response = interview_client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        return jsonify({
            "answer": response.text
        })
    except Exception as e:

        print(e)

        error = str(e)

        if "429" in error:
            return jsonify({
                "answer": "⚠️ Gemini API quota exceeded.\n\nPlease try again after some time or use another API key."
            }), 429

        elif "API_KEY_INVALID" in error or "API key" in error:
            return jsonify({
                "answer": "❌ Invalid Gemini API Key."
            }), 500

        else:
            return jsonify({
                "answer": error
            }), 500


# ==========================================
# Run Flask
# ==========================================

if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )