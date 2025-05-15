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
}

export interface UserData {
  userId: string;
  name: string;
  score: number;
  answers: UserAnswer[];
  timestamp: Date;
}

// Clasa care gestionează datele utilizatorilor
class UserDataService {
  private currentUser: UserData | null = null;

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

    console.log(`Utilizator nou creat: ${name} (ID: ${userId})`);
    return userId;
  }

  // Adaugă un răspuns pentru utilizatorul curent
  addAnswer(questionId: number, answer: string): void {
    if (!this.currentUser) {
      console.error("Nu există niciun utilizator curent!");
      return;
    }

    // Verifică dacă există deja un răspuns pentru această întrebare
    const existingAnswerIndex = this.currentUser.answers.findIndex(
      (a) => a.questionId === questionId
    );

    if (existingAnswerIndex >= 0) {
      // Actualizează răspunsul existent
      this.currentUser.answers[existingAnswerIndex].answer = answer;
    } else {
      // Adaugă un nou răspuns
      this.currentUser.answers.push({
        questionId,
        answer,
      });
    }

    console.log(`Răspuns adăugat pentru întrebarea ${questionId}: ${answer}`);
  }

  // Finalizează testul și calculează scorul
  async finishQuiz(score: number): Promise<void> {
    if (!this.currentUser) {
      console.error("Nu există niciun utilizator curent!");
      return;
    }

    this.currentUser.score = score;

    try {
      // Salvează datele utilizatorului în Firestore
      const userDocRef = await addDoc(collection(db, "users"), {
        name: this.currentUser.name,
        score: this.currentUser.score,
        answers: this.currentUser.answers,
        timestamp: Timestamp.fromDate(this.currentUser.timestamp),
      });

      console.log(
        `Test finalizat pentru ${this.currentUser.name} cu scorul ${score}%`
      );
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
        userData.push({
          userId: doc.id,
          name: data.name,
          score: data.score,
          answers: data.answers,
          timestamp: data.timestamp.toDate(),
        });
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
