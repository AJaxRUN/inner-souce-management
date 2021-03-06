import React from "react";

const StatusTags = ({ statusTag }) => {
    const statusTags = [...statusTag];
    const style = {
        open: "bg-nebula-blue-light text-nebula-blue",
        applied: "bg-nebula-yellow-light text-nebula-yellow",
        ongoing: "bg-nebula-green-light text-nebula-green",
        working: "bg-nebula-green-light text-nebula-green",
        completed: "bg-nebula-purple-light text-nebula-purple",
        job: "bg-nebula-blue-light text-nebula-blue",
        milestones: "bg-nebula-yellow-light text-nebula-yellow",
    };
    return statusTags.map((tag) => 
        <div key={tag}
            className={style[tag] + " px-2 py-1 mr-2 font-bold rounded tracking-widest inline text-xs"}>{tag.toUpperCase()}</div>,
    );
};

export default StatusTags;
