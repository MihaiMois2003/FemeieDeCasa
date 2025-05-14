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
  private userData: UserData[] = [];
  private currentUser: UserData | null = null;

  // Creează un nou utilizator cu numele dat
  createUser(name: string): string {
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
  finishQuiz(score: number): void {
    if (!this.currentUser) {
      console.error("Nu există niciun utilizator curent!");
      return;
    }

    this.currentUser.score = score;

    // Adaugă utilizatorul în lista de date
    this.userData.push({ ...this.currentUser });

    console.log(
      `Test finalizat pentru ${this.currentUser.name} cu scorul ${score}%`
    );
    console.log("Date utilizator salvate:", this.currentUser);
  }

  // Obține datele utilizatorului curent
  getCurrentUser(): UserData | null {
    return this.currentUser;
  }

  // Obține toate datele utilizatorilor
  getAllUserData(): UserData[] {
    return this.userData;
  }

  // Generează un ID unic pentru utilizator
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}

// Exportă o instanță singleton a serviciului
export const userDataService = new UserDataService();
