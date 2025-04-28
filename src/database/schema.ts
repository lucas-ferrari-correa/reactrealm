import { BSON, Realm } from 'realm';

export class User extends Realm.Object<User> {
  _id!: BSON.ObjectId;
  name!: string;
  age!: number;

  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      age: 'int',
    },
  };
}

export class Post extends Realm.Object<Post> {
  _id!: BSON.ObjectId;
  title!: string;
  content!: string;
  createdAt!: Date;

  static schema = {
    name: 'Post',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      content: 'string',
      createdAt: 'date',
    },
  };
}

export class Comment extends Realm.Object<Comment> {
  _id!: BSON.ObjectId;
  text!: string;
  postId!: BSON.ObjectId;

  static schema = {
    name: 'Comment',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      text: 'string',
      postId: 'objectId',
    },
  };
}
