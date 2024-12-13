import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../../schema/post.schema';

import { InputPostDTO } from '../../../dto/post/input-post.dto';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class PostRepository extends BaseRepository<PostDocument> {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<PostDocument>,
	) {
		super(postModel);
	}

	async createPost(userId: string, postInfo: InputPostDTO) {
		const post = new this.postModel({ ...postInfo, userId });
		const savedPost = await post.save();
		return savedPost.Mapper();
	}
}
