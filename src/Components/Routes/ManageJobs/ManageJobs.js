import React, { useEffect, useContext } from "react";
import TabStrip from "../../Common/TabStrip/TabStrip";
import { Redirect, Route, withRouter } from "react-router";
import { Link } from "react-router-dom";
import Navbar from "../../Navigation/Navbar/Navbar";
import JobCard from "../../Jobs/JobCard";
import Button from "../../Common/Button/Button";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_CREATED_JOBS } from "../../../queries";
import Placeholder from "../../Placeholders/placeholder";
import LoadingIndicator from "../../Common/LoadingIndicator/LoadingIndicator";
import { AuthenticationContext } from "../../../hooks/useAuthentication/provider";
import CreateJobsPlaceholder from "../../../assets/images/create_jobs_placeholder.svg";
import Avatar from "../../Common/Avatar/Avatar";

const ManageJobs = (props) => {
    const { user } = useContext(AuthenticationContext);
    const { loading, error, data } = useQuery(GET_CREATED_JOBS, { variables: { userId: user.id }, fetchPolicy: "cache-first" });
    //TODO: Try to figure out how to update cache without making another query
    const [getJobs, { loading: l2, error: e2, data: d2 }] = useLazyQuery(GET_CREATED_JOBS, { variables: { userId: user.id }, fetchPolicy: "cache-and-network" });

    useEffect(() => {
        getJobs({ variables: { userId: user.id } });
        return (() => { });
    }, [props]);

    if (location.pathname === "/manageJobs") {
        return (<Redirect to={props.match.url + "/open"} />);
    }

    var openJobsCreated = [], ongoingJobsCreated = [], completedJobsCreated = [];

    if (loading || !data) return <LoadingIndicator />;
    else if (error) return "error!";



    if (data.User.createdJobs) {
        data.User.createdJobs.forEach(createdJob => {
            // If the created job is in open status

            if (createdJob.status.toUpperCase() == "OPEN") {
                openJobsCreated.push(createdJob);
            }
            // If app job
            else if (createdJob.status.toUpperCase() == "ONGOING") {
                ongoingJobsCreated.push(createdJob);
            }
            // If the application status is accepted and job status is completed then the job the user has taken(maybe milestones) is completed
            else if (createdJob.status.toUpperCase() == "COMPLETED") {
                completedJobsCreated.push(createdJob);
            }
        });
    }

    const createJobsPlaceholder = (
        <Placeholder
            heading="Create jobs for people to apply to!"
            body="Once you create a job and publish it, people will be able to apply to it and work on the whole job or specific milestones."
            buttonLabel="Create Job"
            image={CreateJobsPlaceholder}
            linkLocation="/createJob"
        />
    );

    const ongoingJobsPlaceholder = (
        <Placeholder
            heading="No created jobs with ongoing status!"
            body="Once you accept any applicants into a job it will appear here."
            image={CreateJobsPlaceholder}
        />
    );
    const completedJobsPlaceholder = (
        <Placeholder
            heading="No jobs completed... yet!"
            body="You'll find jobs created by you that were completed here."
            image={CreateJobsPlaceholder}
        />
    );

    const tabList = [
        {
            title: "Open",
            location: "open",
            count: openJobsCreated.length,
            notify: true,
        },
        {
            title: "Ongoing",
            location: "ongoing",
            count: ongoingJobsCreated.length,
        },
        {
            title: "Completed",
            location: "completed",
            count: completedJobsCreated.length,
        },
    ];

    return (
        <div className="px-10">
            <Navbar />
            <div className="flex py-4 mx-1 z-20">
                <div className="text-xl font-semibold flex-1">
                        Created Jobs
                </div>
                <div className="flex">
                    <Link to="/createJob">
                        <Button type="primary" label="Create new job" />
                    </Link>
                </div>
            </div>
            <TabStrip tabs={tabList} />
            <div className="my-2">
                <Route exact path={props.match.url + "/open"}
                    component={(props) => <CreatedJobList jobs={openJobsCreated} placeholder={createJobsPlaceholder} />} />
                <Route exact path={props.match.url + "/ongoing"}
                    component={(props) => <CreatedJobList jobs={ongoingJobsCreated} placeholder={ongoingJobsPlaceholder} />} />
                <Route exact path={props.match.url + "/completed"}
                    component={(props) => <CreatedJobList jobs={completedJobsCreated} placeholder={completedJobsPlaceholder} />} />
            </div>
        </div>
    );
};

const CreatedJobList = (props) => {
    if ((!props.jobs.length || props.jobs.length === 0)) {
        return props.placeholder;
    }
    return (
        props.jobs.map((job, index) => {
            return (
                <div className="my-8 border border-nebula-grey-400 rounded-lg transition duration-300 shadow-none cursor-pointer hover:shadow-lg" key={index}>
                    {
                        job.applications.pendingCount
                            ?
                            <Link to={"/jobDetails/" + job.id} >
                                <div className="flex mt-1">
                                    <div className="self-center font-semibold hover:text-nebula-blue text-sm ml-6 ">
                                        <Link to={"/jobDetails/" + job.id+"/applications"} >
                                            View {job.applications.pendingCount} Applications
                                        </Link>
                                    </div>
                                    <div className="flex flex-row py-8 px-8">
                                        {
                                            job.applications.applications
                                                ?
                                                (() => {
                                                    //To extract unique applicants' photoURLs
                                                    const uniqueApplicantIdArray = Array.from(new Set(job.applications.applications.map((application) => application.applicant.id))).slice(0,3);
                                                    const uniqueApplicationArray = uniqueApplicantIdArray.map((id) => {
                                                        return job.applications.applications.find(application => application.applicant.id == id);
                                                    });
                                                    return uniqueApplicationArray.map((application, key) => {
                                                        if (application.status.toUpperCase() == "PENDING") {
                                                            return (
                                                                <Avatar key={application.applicant.id} imagePath={application.applicant.photoUrl} className={"p-0 absolute self-center h-10 w-10 absolute "+"ml-"+(key*4)} />
                                                            );
                                                        }
                                                    });
                                                })()
                                                :
                                                ""
                                        }
                                    </div>

                                    <div className="self-center text-lg font-semibold text-nebula-grey-500 ml-24">{job.applications.pendingCount > 3 ? ("+" + (job.applications.pendingCount - 3)) : ""}</div>
                                </div>
                            </Link>
                            :
                            ""
                    }
                    <hr />
                    <JobCard data={job} manageJobs={true} />
                </div>
            );
        })
    );
};


export default (withRouter(ManageJobs));
