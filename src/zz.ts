import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # ------------------------------------------------------
  # THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
  # ------------------------------------------------------

  type UserAnswer {
    id: Float!
    userAnswers: String!
    questionText: String!
    answerText: String!
    successId: Float!
  }

  type Success {
    id: Float!
    score: Int
    fromServey: Servey
    hasUserAnswers: [UserAnswer!]!
  }

  type Servey {
    id: Float!
    title: String!
    description: String!
    isUsed: Boolean!
    created: DateTime!
    hasQuestions: [Question!]
  }

  """
  A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
  """
  scalar DateTime

  type Question {
    id: Int!
    text: String!
    isObjective: Boolean!
    hasAnswers: [Answer!]
  }

  type Answer {
    id: String!
    text: String!
    reward: Float!
    listNumber: String!
    questionId: Float!
  }

  type Query {
    allServey: [Servey!]!
    servey(serveyId: Int!): Servey!
    allSuccess: [Success!]!
    success(serialNumber: Float!): Success!
  }

  type Mutation {
    newServey: Servey!
    updateServey(toChange: UpdateServeyDto!): Servey!
    deleteServey(inputServeyId: Float!): Boolean!
    newQuestion(createQuestuinInput: CreateQuestionDto!): Question!
    updateQuestion(toChange: UpdateQuestionDto!): Question!
    deleteQuestion(inputQuestionId: Float!): Boolean!
    newAnswer(createAnswerInput: CreateAnswerDto!): Answer!
    deleteAnswer(inputAnswerId: Float!): Boolean!
    updateAnswer(toChange: UpdateAnswerDto!): Boolean!
    serveySeccess(
      inputServeyIdAndListNumberOrUserAnswer: CreateSuccessDto!
    ): Success!
    deleteSuccess(inputSerialNumber: Float!): Boolean!
  }

  input UpdateServeyDto {
    serveyId: Float!
    title: String!
    description: String!
  }

  input CreateQuestionDto {
    fromServeyId: Float!
    isObjective: Boolean!
  }

  input UpdateQuestionDto {
    questionId: Float!
    text: String!
  }

  input CreateAnswerDto {
    questionId: Float!
  }

  input UpdateAnswerDto {
    questionId: Float!
    listNumber: String!
    text: String
    reward: Float
  }

  input CreateSuccessDto {
    serveyId: Float!
    answerArr: [String!]!
  }
`;
