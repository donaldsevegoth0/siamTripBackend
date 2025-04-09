db.posts.aggregate([
    {
        $match: {
            $or: [
                { title: { $regex: /Bangkok/i } },
                { location: { $regex: /Bangkok/i } },
                { describe: { $regex: /Bangkok/i } }
            ]
        }
    },
    { $project: { title: 1, location: 1, describe: 1 } }  // 只显示标题、地点和描述
]);
  