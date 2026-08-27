import React from "react";
import classNames from "classnames";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";
import { VacuumIcon } from "../../../components/Devices/Roborock/VacuumIcon";
import { useActionLock } from "../helpers/useActionLock";

const OverviewActionButton = ({ action }) => {
  const [run, pending] = useActionLock();
  const isVacuum = action.variant === "vacuum";
  const isDisabled = !action.id;

  return (
    <button
      type="button"
      className={classNames("andre-overview-action", {
        "andre-overview-action--pending": pending,
        "andre-overview-action--vacuum": isVacuum,
        "andre-overview-action--mood": action.variant === "mood",
        "andre-overview-action--lights-on": action.variant === "lights-on",
        "andre-overview-action--lights-off": action.variant === "lights-off",
        "andre-overview-action--disabled": isDisabled,
      })}
      aria-label={action.label}
      disabled={pending || isDisabled}
      title={isDisabled ? "Legg til Homey flow-id i rooms.js" : undefined}
      onClick={(event) => {
        if (!action.id) return;
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
    <section
      className="andre-overview-moods"
      aria-label="Moods for hele etasjen"
    >
      <h2 className="andre-overview-moods-title">Moods for hele etasjen</h2>
      <div className="andre-overview-actions">
        {actions.map((action) => (
          <OverviewActionButton
            key={`${action.label}-${action.id ?? "placeholder"}`}
            action={action}
          />
        ))}
      </div>
    </section>
  );
};
