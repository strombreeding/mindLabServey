# 테이블들

## 설문 완료 테이블

complate_servey

| id  | serveyId | score | serial |
| --- | -------- | ----- | ------ |
|     |          |       |        |
|     |          |       |        |

## 설문지 테이블

servey

| id  | title    | description | created         | hasQuestions |
| --- | -------- | ----------- | --------------- | ------------ |
|     | 설문제목 | 설문내용    | bigint date.now |              |
|     |          |             |                 |              |

## 질문지 테이블

question

| id  | text     | fromServeyId | created         | hasAnswers |
| --- | -------- | ------------ | --------------- | ---------- |
|     | 질문내용 | 소속 설문    | bigint date.now |            |

## 객관식 답변 테이블

answer

| id  | text       | reward(점수)  | fromQuestionId |
| --- | ---------- | ------------- | -------------- |
|     | 객관식내용 | custom number | 소속 질문      |
