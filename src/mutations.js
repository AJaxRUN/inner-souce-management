import { gql } from "@apollo/client";

//To perform the authentication of the user login
export const AUTHENTICATE = gql`
    mutation authenticate($githubCode: String!) {
        authenticate(githubCode: $githubCode){
        profile{
            id
            name
            email
            githubName
            onboarded
            photoUrl
        }
        token
        }
    }
`;

// To update the user profile details
export const UPDATE_USER_PROFILE = gql`
    mutation ($userInput: UpdateUserInput) {
        updateProfile(user: $userInput){
            id
        }
    }
`;

// To create a new job
export const CREATE_JOB = gql`
    mutation($job: CreateJobInput){
        createJob(job: $job) {
            id
            title
        }
    }
`;

// To delete an existing job
export const DELETE_JOB = gql`
    mutation($jobId: ID!){
        deleteJob(jobID: $jobId) {
            id
            title
        }
    }
`;

// To post a new 
export const POST_COMMENT = gql`
    mutation($comment: String!, $jobId: ID!){
        addCommentToJob(jobID: $jobId, comment: $comment) {
            id
        }
    }
`;

// To delete a comment 
export const DELETE_COMMENT = gql`
    mutation($commentId: ID!){
        deleteComment(id: $commentId) {
            id
        }
    }
`;

// To update a comment
export const UPDATE_COMMENT = gql`
    mutation($comment: String!, $commentId: ID!){
        updateComment(id: $commentId, comment: $comment) {
            id
        }
    }
`;

// To create a job application
export const APPLY_TO_JOB = gql`
    mutation($jobId: ID!){
        createJobApplication(jobID: $jobId) {
            id
        }
    }
`;

// To withdraw a job application
export const WITHDRAW_JOB_APPLICATION = gql`
    mutation($jobId: ID!){
        deleteJobApplication(jobID: $jobId) {
            id
        }
    }
`;