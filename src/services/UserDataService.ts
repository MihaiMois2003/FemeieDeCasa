import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Definirea tipurilor pentru datele utilizatorului și răspunsuri
export interface UserAnswer {
  questionId: number;
  answer: string;
  points: number; // Add points field
}

export interface UserData {
  userId: string;
  name: string;
  score: number;
  totalPoints?: number; // Add optional totalPoints
  maxPossiblePoints?: number; // Add optional maxPossiblePoints
  answers: UserAnswer[];
  timestamp: Date;
  questionsSelected?: number[]; // Add optional array of questions that were selected
}

// Clasa care gestionează datele utilizatorilor
class UserDataService {
  private currentUser: UserData | null = null;
  private currentAnswers: UserAnswer[] = [];
  private questionsSelected: number[] = [];

  // Creează un nou utilizator cu numele dat
  async createUser(name: string): Promise<string> {
    const userId = this.generateUserId();

    this.currentUser = {
      userId,
      name,
      score: 0,
      answers: [],
      timestamp: new Date(),
    };

    // Reset answers and selected questions for new user
    this.currentAnswers = [];
    this.questionsSelected = [];

    console.log(`Utilizator nou creat: ${name} (ID: ${userId})`);
    return userId;
  }

  // Track which questions were selected for this quiz
  setQuestionsSelected(questionIds: number[]): void {
    this.questionsSelected = questionIds;
    console.log(`Selected questions for this quiz: ${questionIds.join(", ")}`);
  }

  // Adaugă un răspuns pentru utilizatorul curent
  addAnswer(questionId: number, answer: string, points: number = 0): void {
    if (!this.currentUser) {
      console.error("Nu există niciun utilizator curent!");
      return;
    }

    // Create the answer object with points
    const answerObj: UserAnswer = {
      questionId,
      answer,
      points,
    };

    // Verifică dacă există deja un răspuns pentru această întrebare
    const existingAnswerIndex = this.currentAnswers.findIndex(
      (a) => a.questionId === questionId
    );

    if (existingAnswerIndex >= 0) {
      // Actualizează răspunsul existent
      this.currentAnswers[existingAnswerIndex] = answerObj;
    } else {
      // Adaugă un nou răspuns
      this.currentAnswers.push(answerObj);
    }

    console.log(
      `Răspuns adăugat pentru întrebarea ${questionId}: ${answer} (${points} puncte)`
    );
  }

  // Finalizează testul și calculează scorul
  async finishQuiz(
    score: number,
    totalPoints?: number,
    maxPossiblePoints?: number
  ): Promise<void> {
    if (!this.currentUser) {
      console.error("Nu există niciun utilizator curent!");
      return;
    }

    // Update current user with final data
    this.currentUser.score = score;
    this.currentUser.answers = [...this.currentAnswers]; // Save the complete answers array

    // Add points data if provided
    if (totalPoints !== undefined && maxPossiblePoints !== undefined) {
      this.currentUser.totalPoints = totalPoints;
      this.currentUser.maxPossiblePoints = maxPossiblePoints;
    }

    // Add selected questions if available
    if (this.questionsSelected.length > 0) {
      this.currentUser.questionsSelected = [...this.questionsSelected];
    }

    try {
      // Pregătim datele pentru salvare în Firestore
      const firestoreData = {
        name: this.currentUser.name,
        score: this.currentUser.score,
        answers: this.currentUser.answers,
        timestamp: Timestamp.fromDate(this.currentUser.timestamp),
      };

      // Add additional fields if they exist
      if (this.currentUser.totalPoints !== undefined) {
        Object.assign(firestoreData, {
          totalPoints: this.currentUser.totalPoints,
        });
      }

      if (this.currentUser.maxPossiblePoints !== undefined) {
        Object.assign(firestoreData, {
          maxPossiblePoints: this.currentUser.maxPossiblePoints,
        });
      }

      if (this.currentUser.questionsSelected !== undefined) {
        Object.assign(firestoreData, {
          questionsSelected: this.currentUser.questionsSelected,
        });
      }

      // Salvează datele utilizatorului în Firestore
      const userDocRef = await addDoc(collection(db, "users"), firestoreData);

      console.log(
        `Test finalizat pentru ${this.currentUser.name} cu scorul ${score}%`
      );
      if (totalPoints !== undefined && maxPossiblePoints !== undefined) {
        console.log(`Puncte: ${totalPoints}/${maxPossiblePoints}`);
      }
      console.log("Date utilizator salvate în Firebase cu ID:", userDocRef.id);
      return Promise.resolve();
    } catch (error) {
      console.error("Eroare la salvarea datelor în Firebase:", error);
      return Promise.reject(error);
    }
  }

  // Obține datele utilizatorului curent
  getCurrentUser(): UserData | null {
    return this.currentUser;
  }

  // Obține toate datele utilizatorilor din Firestore
  async getAllUserData(): Promise<UserData[]> {
    try {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(usersQuery);

      const userData: UserData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Create base user object
        const user: UserData = {
          userId: doc.id,
          name: data.name,
          score: data.score,
          answers: data.answers || [],
          timestamp: data.timestamp.toDate(),
        };

        // Add additional fields if they exist in the document
        if (data.totalPoints !== undefined) {
          user.totalPoints = data.totalPoints;
        }

        if (data.maxPossiblePoints !== undefined) {
          user.maxPossiblePoints = data.maxPossiblePoints;
        }

        if (data.questionsSelected !== undefined) {
          user.questionsSelected = data.questionsSelected;
        }

        // Ensure answers have points (for backward compatibility)
        user.answers = user.answers.map((answer) => {
          if (answer.points === undefined) {
            return {
              ...answer,
              points: 0, // Default value for old records
            };
          }
          return answer;
        });

        userData.push(user);
      });

      return userData;
    } catch (error) {
      console.error("Eroare la obținerea datelor din Firebase:", error);
      return [];
    }
  }

  // Generează un ID unic pentru utilizator
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}

// Exportă o instanță singleton a serviciului
export const userDataService = new UserDataService();
