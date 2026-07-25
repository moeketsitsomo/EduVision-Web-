import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PublicPostsController } from './public-posts.controller';

@Module({
  controllers: [PostsController, PublicPostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
