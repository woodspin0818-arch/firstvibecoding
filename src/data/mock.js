export const currentUser = {
  id: '1',
  displayName: '陈一鸣',
  username: 'chen_yiming',
  coverColor: 'linear-gradient(135deg, #1d9bf0 0%, #0d6efd 100%)',
  bio: '用设计解决真实问题。关注产品体验、系统思维和人机交互。偶尔写写对行业的观察。',
  location: '北京',
  website: 'chenyiming.design',
  joinedAt: '2021年6月',
  verified: true,
  followingCount: 486,
  followersCount: 23100,
};

export const otherUser = {
  id: '2',
  displayName: '林晚舟',
  username: 'lin_wanzhou',
  coverColor: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  bio: '写字的人。相信文字有重量，有温度，有时候也有锋芒。',
  location: '上海',
  website: 'linwanzhou.com',
  joinedAt: '2022年9月',
  verified: false,
  followingCount: 248,
  followersCount: 12600,
};

export const users = { [currentUser.id]: currentUser, [otherUser.id]: otherUser };

const makePost = (id, author, body, time, likes, retweets, replies) => ({
  id, author, body, time, likes, retweets, replies, liked: false, retweeted: false,
});

export const userPosts = {
  [currentUser.id]: [
    makePost('p1', currentUser, '好的设计不是让用户感叹"这好漂亮"，而是让用户完全忘记设计的存在，只感受到"这用起来真顺手"。\n#产品设计 #UX思考', '1小时', 2300, 128, 45),
    makePost('p2', currentUser, '做了一个小实验：把同一个功能用5种不同的交互方式实现，然后让10个用户测试。\n结果最"简单"的方案赢了，但不是最"少"的那个——是最"清晰"的那个。\n简单 ≠ 少，清晰才是核心。#设计实验', '昨天', 4100, 367, 89),
    makePost('p3', currentUser, 'AI 工具正在改变设计工作流，但有一件事它还做不到：\n理解用户真正想要什么，而不是他们说他们想要什么。\n这个差距，就是设计师存在的价值。#AI与设计', '2天', 8700, 891, 203),
    makePost('p4', currentUser, '分享一个选色技巧：不要从色相开始选，从明度开始。先确定深浅关系，再加颜色，层次感会好很多。#设计技巧', '3天', 1560, 445, 67),
    makePost('p5', currentUser, '今天review了一个产品原型，发现一个问题：所有的"高级功能"都藏得很深，但用户最常用的操作却要点三层才能到。\n功能的层级应该跟随使用频率，而不是跟随产品经理的自我感觉。', '5天', 3200, 678, 134),
    makePost('p6', currentUser, '设计系统不是组件库，组件库只是设计系统的一部分。\n设计系统是一套决策框架，包括原则、模式、组件和文档。#设计系统', '1周', 980, 234, 45),
    makePost('p7', currentUser, '用户研究最大的误区：问用户"你想要什么"。\n用户不知道自己想要什么，但他们知道自己遇到了什么问题。\n从问题出发，而不是从解决方案出发。', '2周', 5600, 1200, 289),
  ],
  [otherUser.id]: [
    makePost('o1', otherUser, '读完了《百年孤独》第三遍。每次读都像第一次，又像最后一次。\n#阅读 #文学', '3小时', 892, 67, 31),
    makePost('o2', otherUser, '今天在咖啡馆写了四个小时，写了三百字，删了两百八十字。\n剩下的二十字，是今天最诚实的自己。\n#写作日常', '昨天', 2100, 234, 88),
    makePost('o3', otherUser, '有人问我为什么坚持写作。\n因为有些话，说出来会消散，只有写下来，才能留住。\n#随想', '3天', 5400, 512, 156),
    makePost('o4', otherUser, '语言是有重量的。同样的意思，不同的词，落在心里的感觉完全不同。\n写作就是在找那个最准确的词。', '5天', 3200, 445, 98),
  ],
};

export const userReplies = {
  [currentUser.id]: [
    { ...makePost('r1', currentUser, '完全同意，一致性是设计系统最核心的价值，不是美观。', '2小时', 89, 12, 8), replyTo: 'design_weekly' },
    { ...makePost('r2', currentUser, '这个问题很好，我觉得关键在于区分"用户需求"和"用户诉求"，两者经常不一样。', '1天', 234, 56, 23), replyTo: 'pm_notes' },
    { ...makePost('r3', currentUser, '说得对，但我觉得还要加一点：好的文档比好的代码更难写。', '3天', 156, 34, 12), replyTo: 'dev_thoughts' },
  ],
  [otherUser.id]: [
    { ...makePost('or1', otherUser, '这本书改变了我对时间的理解，强烈推荐。', '1天', 45, 8, 5), replyTo: 'book_club' },
  ],
};

export const userLikes = {
  [currentUser.id]: [
    makePost('l1', otherUser, '设计不是装饰，是沟通。每一个视觉决策背后都应该有一个清晰的沟通意图。', '3小时', 4500, 890, 156),
    makePost('l2', otherUser, '产品经理和设计师最大的分歧往往不在方案，而在对"用户"的定义。', '2天', 2100, 345, 78),
    makePost('l3', otherUser, '最好的产品，是让用户感觉不到产品的存在。', '4天', 6700, 1230, 234),
  ],
  [otherUser.id]: [
    makePost('ol1', currentUser, '好的设计不是让用户感叹"这好漂亮"，而是让用户完全忘记设计的存在。', '1小时', 2300, 128, 45),
  ],
};
