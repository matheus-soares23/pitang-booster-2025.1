export class bubbleSortService {
    getResult(array: number[]): number[] {
        const arrayToSort = [...array];
        return this.bubbleSort(arrayToSort);
    }
    
    private bubbleSort(array: number[]): number[] {
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (!this.runOneRow(array, i, n)) {
                break;
            }
        }
        
        return array;
    }

    private runOneRow(array: number[], row: number, arrayLength: number): boolean {
        let swapped = false;

        for (let j = 0; j < arrayLength - row - 1; j++) {
            if (this.shouldSwap(array, j)) {
                this.swap(array, j, j + 1);
                swapped = true;
            }
        }
        
        return swapped;
    }

    private shouldSwap(array: number[], index: number): boolean {
        return array[index] > array[index + 1];
    }

    private swap(array: number[], index1: number, index2: number): void {
        [array[index1], array[index2]] = [array[index2], array[index1]];
    }
}