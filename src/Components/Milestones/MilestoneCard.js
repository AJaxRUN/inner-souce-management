import React, { useContext, useState } from "react";
import * as Icons from "react-feather";
import InfoTag from "../Common/InfoTag/InfoTag";
import StatusTags from "../Common/StatusTags/StatusTags";
import { DurationParser } from "../../HelperFunctions/DurationParser";
import { TOGGLE_MILESTONE_COMPLETED } from "../../mutations";
import { useMutation } from "@apollo/client";
import {
    GET_JOB_DETAILS,
    GET_MILESTONES,
} from "../../queries";
import { CREATE_REVIEW_MUTATION, UPDATE_REVIEW_MUTATION } from "../../mutations";
import LoadingIndicator from "../Common/LoadingIndicator/LoadingIndicator";
import Portal from "../Containers/Portal";
import { useClickOutside } from "../../hooks/useClickOutside/hook";
import { AddUpdateReviewModal } from "../Modals/AddUpdateReviewModal";
import { MilestoneReviewTag } from "../Ratings/MilestoneReviewTag";

const MilestoneCard = ({ jobId, expanded, isEditMode, isJobAuthor, milestone, className, index, lastIndex, editMilestone, jobAuthorName }) => {

    const initialState = {
        isExpanded: expanded,
    };
    const [state, setState] = useState(initialState);


    const {
        ref: addReviewModalRef,
        isComponentVisible: addReviewModalVisible,
        setIsComponentVisible: setAddReviewModalVisible,
    } = useClickOutside(false);



    const [toggleMilestoneMutation, { toggleMilestoneLoading, toggleMilestoneError }] = useMutation(
        TOGGLE_MILESTONE_COMPLETED,
        {
            refetchQueries: [
                {
                    query: GET_JOB_DETAILS,
                    variables: { jobId: jobId },
                },
                {
                    query: GET_MILESTONES,
                    variables: { jobId: jobId },
                },
            ],
            onCompleted: ((data) => {
                if (data.toggleMilestoneCompleted.assignedTo != null) setAddReviewModalVisible(true);
            }
            ),
        },
    );
    if (toggleMilestoneLoading) return <LoadingIndicator/>;
    if (toggleMilestoneError) {
        return <p>Toggle milestone mutation
            Error! {toggleMilestoneError}</p>;
    }

    const toggleExpandedState = () => {
        const currentState = state.isExpanded;
        setState({
            isExpanded: !currentState,
        });
    };

    const toggleMilestoneStatus = (event) => {
        const milestoneId = event.currentTarget.id;
        toggleMilestoneMutation({
            variables: {
                milestoneId: milestoneId,
            },
        }).catch((e) => {
            alert("Could not toggle milestones status: "+ e);
        });
    };

    const isExpanded = state.isExpanded;
    const isMilestoneCompleted = milestone.status
        ? (milestone.status.toUpperCase() === "COMPLETED")
        : false;

    return (
        <div className={"flex " + className}>
            <div>
                <svg
                    className="w-3 relative mt-6 fill-current text-nebula-grey-400"
                    viewBox="0 0 12 12" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="6" fill=""/>
                </svg>
                <div className={(index === lastIndex - 1 ? "" : "h-full ") +
              " w-px mx-auto bg-nebula-grey-400"}/>
            </div>
            <div className="mx-4 flex-1 ">
                <div className="flex items-center flex-wrap">
                    <div className="flex flex-1 flex-col">
                        <div className="h-4"/>
                        <div className="flex-1">
                            <p
                                className="font-semibold text-nebula-grey-600">Milestone
                              #{index + 1}</p>
                        </div>
                        <div className="h-4"/>
                    </div>
                    {isEditMode &&
                  <div
                      className="flex text-nebula-grey-500 hover:text-nebula-blue"
                      id={"#" + index}
                      onClick={editMilestone}
                  >
                      <Icons.Edit className=" mx-4"/>
                      {/* <Icons.Delete className="text-nebula-red mx-4" /> */}
                  </div>
                    }
                    {
                        isJobAuthor
                            ?
                            isMilestoneCompleted
                                ?<div id={milestone.id}
                                    className="flex items-center text-nebula-blue mx-4"
                                >
                                    <div className="px-2">Completed</div>
                                    <Icons.CheckCircle className="h-4 w-4"/>
                                </div>
                                : <div
                                    id={milestone.id}
                                    onClick={toggleMilestoneStatus}
                                    className="flex items-center text-nebula-grey-600 hover:text-nebula-blue mx-4 cursor-pointer"
                                >
                                    <div className="px-2">Mark as completed</div>
                                    <Icons.CheckCircle className="h-4 w-4"/>
                                </div>
                            :
                            ""
                    }
                </div>
                <div
                    className="bg-white rounded-md shadow-none border-nebula-grey-400 border px-6 py-6 cursor-pointer transition duration-100 hover:shadow-md"
                    onClick={toggleExpandedState}>
                    <div className="flex flex-row justify-start items-start">
                        <p
                            className="text-base leading-tight flex-1 font-semibold mb-2 pr-4 ">{milestone.title}</p>

                        <button
                            className={" transition duration-150 ease-in-out transform " +
                        (isExpanded ? "rotate-0" : "rotate-180")}>
                            <Icons.ChevronUp/>
                        </button>
                    </div>
                    {
                        milestone.status ?
                            <StatusTags
                                statusTag={[milestone.status.toLowerCase()]}/>
                            : ""
                    }
                    {milestone.review &&
                    <MilestoneReviewTag
                        isAuthor={isJobAuthor}
                        className="mt-4"
                        milestone = {milestone}
                        jobAuthorName={jobAuthorName}
                        jobId={jobId}
                        milestoneNumber={index}
                    />
                    }
                    {milestone.review == null && isJobAuthor && milestone.assignedTo && milestone.status==="COMPLETED" &&
                        <AddReviewButton milestone={milestone} jobId={jobId} milestoneNumber={index}/>
                    }

                    {isExpanded &&
                  <div>
                      <p
                          className="pt-4 text-sm text-nebula-grey-700 leading-relaxed">{milestone.description ||
                      milestone.desc}</p>
                      <div className="flex flex-row flex-wrap">
                          <InfoTag className="mr-6 mt-4" title="DURATION"
                              data={DurationParser(milestone.duration)}/>
                          <InfoTag className="mr-6 mt-4"
                              title="RESOLUTION METHODS"
                              data={milestone.resolution}/>
                          {
                              milestone.skills ?
                                  <InfoTag
                                      className="mr-6 mt-4"
                                      title="SKILLS NEEDED"
                                      // To convert the incoming type of (if object type) skills to array
                                      data={milestone.skills.map(
                                          (skill, key) => typeof skill === "object"
                                              ? skill.value
                                              : skill)}
                                  />
                                  : []
                          }
                      </div>
                  </div>
                    }

                </div>
            </div>
            <Portal isOpen={addReviewModalVisible}>
                <AddUpdateReviewModal
                    milestoneNumber={index}
                    forwardedRef={addReviewModalRef}
                    close={() => setAddReviewModalVisible(false)}
                    milestone={milestone}
                    jobId={jobId}
                />
            </Portal>
        </div>
    );
};

const AddReviewButton = ({milestone, jobId, milestoneNumber})=> {
    const {
        ref: addReviewModalRef,
        isComponentVisible: addReviewModalVisible,
        setIsComponentVisible: setAddReviewModalVisible,
    } = useClickOutside(false);

    return (
        <div className="mt-4">
            <button
                aria-label="edit feedback"
                className="text-xs  text-nebula-blue"
                onClick={event => {
                    event.stopPropagation();
                    setAddReviewModalVisible(true);
                }}
            >
              Add a review for {milestone.assignedTo.name}
            </button>
            <Portal isOpen={addReviewModalVisible}>
                <AddUpdateReviewModal
                    forwardedRef={addReviewModalRef}
                    assignedUser = {milestone.assignedTo.name}
                    close={() => setAddReviewModalVisible(false)}
                    milestone={milestone}
                    jobId={jobId}
                    milestoneNumber={milestoneNumber}
                />
            </Portal>
        </div>
    );
};

export default MilestoneCard;
