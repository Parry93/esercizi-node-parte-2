class Singleton {
  constructor() {
    this.array = [];
  }

  output(value) {
    const result = this.array.push(value);
    return result;
  }
}

export const singletonInstance = new Singleton();
//esporto l'istanza della classe
