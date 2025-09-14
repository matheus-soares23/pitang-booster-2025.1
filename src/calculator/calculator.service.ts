export class calculatorService {
  async getResult(expression: string): Promise<number> {
    const expressionParts = expression.trim().split(/\s+/);

    this.validateInput(expressionParts);

    const numbers: number[] = [];
    const operations: string[] = [];

    for (let i = 0; i < expressionParts.length; i++) {
      if (i % 2 === 0) {
        numbers.push(this.parseNumber(expressionParts[i]));
      } else {
        operations.push(this.validateOperator(expressionParts[i]));
      }
    }

    return this.calculateExpression(numbers, operations);
  }

  private calculateExpression(numbers: number[], operations: string[]): number {
    let i = 0;
    while (i < operations.length) {
      if (operations[i] === "*" || operations[i] === "/") {
        const result = this.calculateOperation(
          numbers[i],
          numbers[i + 1],
          operations[i]
        );
        numbers.splice(i, 2, result);
        operations.splice(i, 1);
      } else {
        i++;
      }
    }

    let result = numbers[0];
    for (let i = 0; i < operations.length; i++) {
      result = this.calculateOperation(result, numbers[i + 1], operations[i]);
    }

    return result;
  }

  private calculateOperation(
    a: number,
    b: number,
    operation: string
  ): number {
    switch (operation) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
      default:
        throw new Error(`${operation} nao é um operador válido`);
    }
  }

  private validateInput(expressionParts: string[]): void {
    if (expressionParts.length < 3 || expressionParts.length % 2 === 0) {
      throw new Error(
        "Formato de entrada inválido. Formato esperado: número operador número..."
      );
    }
  }

  private parseNumber(value: string): number {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new Error(`${value} Não é um número válido`);
    }
    return num;
  }

  private validateOperator(operator: string): string {
    if (!["+", "-", "*", "/"].includes(operator)) {
      throw new Error(`${operator} nao é um operador válido`);
    }
    return operator;
  }
}
