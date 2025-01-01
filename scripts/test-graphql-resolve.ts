/**

type __Root {
  query: Query
}

type Query {
  users: [User]
}
type User {
  id: ID!
  name: String
  posts: [Post]
}
type Post {
  id: ID!
  title: String
  content: String
}
 */

type Lookup = (parent: any, args: any, ctx: any, info: any) => any;

type ObjectType = {
  kind: "object";
  name: string;
  fields: Record<string, Type>;
  lookup?: Lookup;
};

type ArrayType = {
  kind: "array";
  inner: Type;
  lookup?: Lookup;
};

type StringType = {
  kind: "string";
  lookup?: Lookup;
};

type Type = ObjectType | ArrayType | StringType;

const postType: Type = {
  kind: "object",
  name: "Post",
  fields: {
    id: {
      kind: "string",
      lookup: (_, __, { auth }) => {
        console.log("id");
        return !!auth;
      },
    },
    title: {
      kind: "string",
      lookup: (_, __, { auth }) => {
        console.log("title");
        return !!auth;
      },
    },
    content: {
      kind: "string",
      lookup: (_, __, { auth }) => {
        console.log("content");
        return !!auth;
      },
    },
  },
  lookup: (_, __, { auth }) => {
    console.log("post");
    return !!auth;
  },
};

const userType: Type = {
  kind: "object",
  name: "User",
  fields: {
    id: {
      kind: "string",
      lookup: (_, __, { auth }) => {
        console.log("id");
        return !!auth;
      },
    },
    name: {
      kind: "string",
      lookup: (_, __, { auth }) => {
        console.log("name");
        return !!auth;
      },
    },
    posts: {
      kind: "array",
      inner: postType,
      lookup: (_, __, { auth }) => {
        console.log("posts");
        return !!auth;
      },
    },
  },
  lookup: (_, __, { auth }) => {
    console.log("user");
    return !!auth;
  },
};

const queryType: Type = {
  kind: "object",
  name: "Query",
  fields: {
    users: {
      kind: "array",
      inner: userType,
      lookup: (_, __, { auth }) => {
        console.log("users");
        return !!auth;
      },
    },
  },
  lookup: (_, __, { auth }) => {
    console.log("query");
    return !!auth;
  },
};

const rootType: ObjectType = {
  kind: "object",
  name: "root",
  fields: {
    query: queryType,
  },
};

/**
query {
  users {
    id
    name
    posts {
      title
      content
    }
  }
}
 */

const request: object = {
  query: {
    users: {
      id: null,
      name: null,
      posts: {
        title: null,
        content: null,
      },
    },
  },
};

function onDown(ctx: {
  parent: unknown;
  args: unknown;
  data: unknown;
  info: unknown;
}): Promise<any> | any {
  console.log("down");
}

type OnDown = typeof onDown;

function onUp(ctx: {
  onDownResults: unknown[];
  parent: unknown;
  args: unknown;
  data: unknown;
  info: unknown;
}) {
  console.log("up");
}

type OnUp = typeof onUp;

function traverse(type: Type, target: object, parent: any) {
  for (const [k, v] of Object.entries(target)) {
    const nextParent = type.lookup
      ? type.lookup(parent, {}, { auth: true }, {})
      : null;

    if (type.kind !== "object") {
      continue;
    }

    const nextType = type.fields[k];
    if (!nextType) {
      throw new Error(`nextPath not exist. nextPath: ${nextType}`);
    }

    if (v) {
      traverse(nextType, v, nextParent);
    }
  }
}

traverse(rootType, request, null);
