# 🧠 MindMirror AI

### AI-Powered Emotion Analysis using Machine Learning

**MindMirror AI** is a web application that analyzes emotions from text and images using Machine Learning, Natural Language Processing (NLP), and Computer Vision.

🌐 **Live Demo:** [MindMirror AI](https://mindmirrorai-53073.web.app)

## ✨ Features

- 📝 **Text Emotion Analysis** — NLP-based emotion prediction.
- 🖼️ **Image Emotion Analysis** — Image-based emotion prediction.
- 🔐 **Secure Authentication** — Firebase Email/Password and Google Sign-In.
- ⚡ **REST API Integration** — FastAPI-powered ML inference.
- 🎨 **Responsive UI** — Modern React interface with protected routes.
- 📊 **Interactive Results** — Clear presentation of analysis outputs.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, JavaScript, HTML, CSS
- **Backend:** Python, FastAPI, REST APIs
- **AI/ML:** Machine Learning, NLP, Computer Vision
- **Authentication:** Firebase Authentication
- **Tools:** Git, GitHub, VS Code

## 🏗️ Architecture

```text
       React Frontend
             │
      Firebase Auth
             │
             ▼
       FastAPI Backend
             │
       ┌─────┴─────┐
       ▼           ▼
   Text Model   Image Model
       │           │
       └─────┬─────┘
             ▼
     Emotion Prediction
             │
             ▼
       Results Display
```

## 📂 Project Structure

```text
MindMirrorAI/
├── backend/          # Backend services
├── Model-1/          # Trained ML model
├── Model-2/          # Trained ML model
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Application pages
│   └── ...
├── public/
├── firestore.rules
├── package.json
├── requirements.txt
└── README.md
```

## 🔮 Future Enhancements

- Improved model performance
- Emotion history and analytics
- Enhanced model explainability
- Multimodal emotion analysis

## ⚠️ Disclaimer

MindMirror AI is an educational and research-oriented project. Its predictions should not be considered medical or psychological diagnoses.

## 👩‍💻 Developer

**Divyadharshini M**  
B.Tech Information Technology | Sri Krishna College of Technology, Coimbatore

[GitHub](https://github.com/Divyadharshini1208) • [LinkedIn](https://linkedin.com/in/divya-dharshini-m12) • [LeetCode](https://leetcode.com/u/DIVYADHARSHINI_M12/)

---

⭐ If you find this project interesting, consider starring the repository.

*Built with React, FastAPI, Machine Learning, and Firebase.*
