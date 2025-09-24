import { Body, Controller, Post } from "@nestjs/common";
import { bubbleSortEntryDto } from "./dto/bubbleSortEntryDto";
import { bubbleSortService } from "./bubbleSort.service";

@Controller("bubble-sort")
export class bubbleSortController {
  constructor(private bubbleSortService: bubbleSortService) {}

  @Post()
  getResult(@Body() bubbleSortEntry: bubbleSortEntryDto) {
    return this.bubbleSortService.getResult(bubbleSortEntry.array);
  }
}
