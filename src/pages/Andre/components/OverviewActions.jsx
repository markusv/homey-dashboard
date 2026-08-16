import React from "react";
import classNames from "classnames";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";
import { VacuumIcon } from "../../../components/Devices/Roborock/VacuumIcon";
import { useActionLock } from "../helpers/useActionLock";

const OverviewActionButton = ({ action }) => {
  const [run, pending] = useActionLock();
  const isVacuum = action.icon === "vacuum";

  return (
    <button
      type="button"
      className={classNames("andre-overview-action", {
        "andre-overview-action--pending": pending,
        "andre-overview-action--vacuum": isVacuum,
        "andre-overview-action--mood": !isVacuum,
      })}
      aria-label={action.label}
      disabled={pending}
      onClick={(event) => {
        run(() => triggerFlow(action.id));
        event.currentTarget.blur();
      }}
    >
      {isVacuum ? (
        <VacuumIcon className="andre-overview-action-icon" />
      ) : (
        <sl-icon
          name={action.icon || "stars"}
          className="andre-overview-action-icon"
        />
      )}
      <span className="andre-overview-action-label">{action.label}</span>
    </button>
  );
};

export const OverviewActions = ({ actions = [] }) => {
  if (!actions.length) return null;

  return (
    <section className="andre-overview-actions" aria-label="Snarveier">
      {actions.map((action) => (
        <OverviewActionButton key={action.id} action={action} />
      ))}
    </section>
  );
};
