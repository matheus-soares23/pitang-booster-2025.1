import { Injectable } from '@nestjs/common';

@Injectable()
export class calculatorService {
  async getResult(expression: string): Promise<number> {
    this.validateGeneralExpressionInput(expression);
    
    const expressionParts = expression.trim().split(/\s+/);

    this.validateInputParts(expressionParts);

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
    if (!isFinite(a) || !isFinite(b)) {
      throw new Error('Não é possível calcular com números infinitos ou inválidos');
    }

    switch (operation) {
      case "+":
        const sum = a + b;
        if (!isFinite(sum)) {
          throw new Error('Resultado da soma excede os limites numéricos');
        }
        return sum;
      case "-":
        const diff = a - b;
        if (!isFinite(diff)) {
          throw new Error('Resultado da subtração excede os limites numéricos');
        }
        return diff;
      case "*":
        const mult = a * b;
        if (!isFinite(mult)) {
          throw new Error('Resultado da multiplicação excede os limites numéricos');
        }
        return mult;
      case "/":
        if (b === 0) {
          throw new Error('Divisão por zero não é permitida');
        }
        const div = a / b;
        if (!isFinite(div)) {
          throw new Error('Resultado da divisão excede os limites numéricos');
        }
        return div;
      default:
        throw new Error(`'${operation}' não é um operador válido`);
    }
  }

  private validateGeneralExpressionInput(expression: string): void {
    if (!expression || typeof expression !== 'string') {
      throw new Error('Expressão não pode estar vazia ou nula');
    }

    const validPattern = /^[0-9+\-*/.\s]+$/;
    if (!validPattern.test(expression)) {
      throw new Error('Expressão contém caracteres inválidos.');
    }

    const consecutiveOperators = /[+\-*/]{2,}/;
    if (consecutiveOperators.test(expression)) {
      throw new Error('Operadores consecutivos não são permitidos');
    }

    const startsWithOperator = /^[+*/]/;
    const endsWithOperator = /[+\-*/]$/;
    if (startsWithOperator.test(expression.trim()) || endsWithOperator.test(expression.trim())) {
      throw new Error('Expressão não pode iniciar ou terminar com operador');
    }
  }

  private validateInputParts(expressionParts: string[]): void {
    if (expressionParts.length < 3 || expressionParts.length % 2 === 0) {
      throw new Error(
        "Formato de entrada inválido. Formato esperado: número operador número..."
      );
    }

    // Validar se números estão em posições pares e operadores em posições ímpares
    for (let i = 0; i < expressionParts.length; i++) {
      if (i % 2 === 0) {
        this.validateNumberPosition(expressionParts[i], i);
      } else {
        this.validateOperatorPosition(expressionParts[i], i);
      }
    }
  }

  private validateNumberPosition(value: string, position: number): void {
    const numberPattern = /^-?\d+(\.\d+)?$/;
    if (!numberPattern.test(value)) {
      throw new Error(`Posição ${position + 1}: '${value}' não é um número válido`);
    }
  }

  private validateOperatorPosition(value: string, position: number): void {
    if (!['+', '-', '*', '/'].includes(value)) {
      throw new Error(`Posição ${position + 1}: '${value}' não é um operador válido`);
    }
  }

  private parseNumber(value: string): number {
    const numberPattern = /^-?\d+(\.\d+)?$/;
    if (!numberPattern.test(value)) {
      throw new Error(`'${value}' não é um formato de número válido`);
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new Error(`'${value}' não pode ser convertido para número`);
    }

    if (!isFinite(num)) {
      throw new Error(`'${value}' resultou em um número infinito`);
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
