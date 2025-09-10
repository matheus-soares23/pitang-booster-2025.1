import { returnSystem } from './src/returnSystem/return_system.service';
import { entryPairDto } from './src/returnSystem/dto/entrypair.dto';

async function main() {
  const system = new returnSystem();
  
  const input = new entryPairDto();
  input.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const result = await system.result(input);
  console.log('Resultado:');
  console.log('Números pares:', result.pairNumbers);
  console.log('Números ímpares:', result.oddNumbers);
  console.log('Soma:', result.sum);
  console.log('Média:', result.average);
}

main().catch(error => console.error('Erro:', error));