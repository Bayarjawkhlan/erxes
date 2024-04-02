const commonTypes = `
  order: Int
  createdAt: Date
  type: String
`;

export const types = ({ tags }) => `

  type Board @key(fields: "_id") {
    _id: String!
    name: String!
    ${commonTypes}
    pipelines: [Pipeline]
  }

  type Pipeline @key(fields: "_id") {
    _id: String!
    name: String!
    status: String
    boardId: String!
    tagId: String
    ${tags ? `tag: Tag` : ''}
    visibility: String!
    memberIds: [String]
    departmentIds: [String]
    members: [User]
    bgColor: String
    isWatched: Boolean
    itemsTotalCount: Int
    userId: String
    createdUser: User
    startDate: Date
    endDate: Date
    metric: String
    hackScoringType: String
    templateId: String
    state: String
    isCheckDate: Boolean
    isCheckUser: Boolean
    isCheckDepartment: Boolean
    excludeCheckUserIds: [String]
    numberConfig: String
    numberSize: String
    ${commonTypes}
  }

  type Stage @key(fields: "_id") {
    _id: String!
    name: String!
    pipelineId: String!
    visibility: String
    code: String
    memberIds: [String]
    canMoveMemberIds: [String]
    canEditMemberIds: [String]
    members: [User]
    departmentIds: [String]
    probability: String
    status: String
    unUsedAmount: JSON
    amount: JSON
    itemsTotalCount: Int
    compareNextStage: JSON
    compareNextStagePurchase: JSON
    stayedDealsTotalCount: Int
    initialDealsTotalCount: Int
    inProcessDealsTotalCount: Int
    stayedPurchasesTotalCount: Int
    initialPurchasesTotalCount: Int
    inProcessPurchasesTotalCount: Int
    formId: String
    age: Int
    defaultTick: Boolean
    ${commonTypes}
  }

  type PipelineChangeResponse {
    _id: String
    proccessId: String
    action: String
    data: JSON
  }

  type ProductsDataChangeResponse {
    _id: String
    proccessId: String
    action: String
    data: JSON
  }

  type ConvertTo {
    ticketUrl: String,
    dealUrl: String,
    taskUrl: String,
    purchaseUrl:String,
  }

  type BoardCount {
    _id: String
    name: String
    count: Int
  }

  input ItemDate {
    month: Int
    year: Int
  }

  input Interval {
    startTime: Date
    endTime: Date
  }
`;

const stageParams = `
  search: String,
  companyIds: [String]
  customerIds: [String]
  assignedUserIds: [String]
  labelIds: [String]
  extraParams: JSON,
  closeDateType: String,
  assignedToMe: String,
  age: Int,
  branchIds: [String]
  departmentIds: [String]
  segment: String
  segmentData:String
  createdStartDate: Date
  createdEndDate: Date
  stateChangedStartDate: Date
  stateChangedEndDate: Date
  startDateStartDate: Date
  startDateEndDate: Date
  closeDateStartDate: Date
  closeDateEndDate: Date
`;

export const queries = `
  ghBoards(type: String!): [Board]
  ghBoardCounts(type: String!): [BoardCount]
  ghBoardGetLast(type: String!): Board
  ghBoardDetail(_id: String!): Board
  ghPipelines(boardId: String, type: String, isAll: Boolean, page: Int, perPage: Int): [Pipeline]
  ghPipelineDetail(_id: String!): Pipeline
  ghPipelineAssignedUsers(_id: String!): [User]
  ghStages(
    isNotLost: Boolean,
    isAll: Boolean,
    pipelineId: String,
    pipelineIds: [String],
    ${stageParams}
  ): [Stage]
  ghStageDetail(_id: String!, ${stageParams}): Stage
  ghConvertToInfo(conversationId: String!): ConvertTo
  ghPipelineStateCount(boardId: String, type: String): JSON
  ghArchivedStages(pipelineId: String!, search: String, page: Int, perPage: Int): [Stage]
  ghArchivedStagesCount(pipelineId: String!, search: String): Int
  ghItemsCountBySegments(type: String!, boardId: String, pipelineId: String): JSON
  ghItemsCountByAssignedUser(type: String!, pipelineId: String!, stackBy: String): JSON
  ghCardsFields: JSON
  ghBoardContentTypeDetail(contentType: String, contentId: String): JSON
  ghBoardLogs(action: String, content:JSON, contentId: String, contentType: String): JSON
  ghCheckFreeTimes(pipelineId: String, intervals: [Interval]): JSON
`;

const commonParams = `
  name: String!,
  type: String!
`;

const pipelineParams = `
  name: String!,
  boardId: String!,
  type: String!,
  stages: JSON,
  visibility: String!,
  memberIds: [String],
  tagId: String,
  bgColor: String,
  startDate: Date,
  endDate: Date,
  metric: String,
  hackScoringType: String,
  templateId: String,
  isCheckDate: Boolean
  isCheckUser: Boolean
  isCheckDepartment: Boolean
  excludeCheckUserIds: [String],
  numberConfig: String,
  numberSize: String,
  departmentIds: [String],
`;

export const mutations = `
  ghBoardsAdd(${commonParams}): Board
  ghBoardsEdit(_id: String!, ${commonParams}): Board
  ghBoardsRemove(_id: String!): JSON
  ghBoardItemUpdateTimeTracking(_id: String!, type: String!, status: String!, timeSpent: Int!, startDate: String): JSON
  ghBoardItemsSaveForGanttTimeline(items: JSON, links: JSON, type: String!): String

  ghPipelinesAdd(${commonParams}, ${pipelineParams}): Pipeline
  ghPipelinesEdit(_id: String!, ${commonParams}, ${pipelineParams}): Pipeline
  ghPipelinesUpdateOrder(orders: [OrderItem]): [Pipeline]
  ghPipelinesWatch(_id: String!, isAdd: Boolean, type: String!): Pipeline
  ghPipelinesRemove(_id: String!): JSON
  ghPipelinesArchive(_id: String!): JSON
  ghPipelinesCopied(_id: String!): JSON

  ghStagesUpdateOrder(orders: [OrderItem]): [Stage]
  ghStagesRemove(_id: String!): JSON
  ghStagesEdit(_id: String!, type: String, name: String, status: String): Stage
  ghStagesSortItems(stageId: String!, type: String, proccessId: String, sortType: String): String
`;
