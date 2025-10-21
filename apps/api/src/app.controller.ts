import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { TopStoriesQueryDto } from './dto/top-stories.dto';

@Controller()
export class AppController {
  constructor(private readonly news: AppService) {}

  @Get('top-stories')
  topStories(@Query() q: TopStoriesQueryDto) {
    return this.news.topStories(q);
  }
}
