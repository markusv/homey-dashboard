import React from "react";
import classNames from "classnames";
import "./RoborockScene.css";
import { ROBOROCK_SCENE } from "../constants";
import dockPhoto from "./roborock-dock.png";
import robotPhoto from "./roborock-robot.png";

const isAwayFromDock = (scene) =>
  scene === ROBOROCK_SCENE.CLEANING ||
  scene === ROBOROCK_SCENE.PAUSED ||
  scene === ROBOROCK_SCENE.RETURNING;

export const RoborockScene = ({ scene, status }) => {
  const away = isAwayFromDock(scene);

  return (
    <div className={classNames("roborock-scene", `roborock-scene--${scene}`)}>
      <div className="roborock-stage">
        {away && (
          <div
            className={classNames("roborock-floor", {
              "roborock-floor--drive": scene === ROBOROCK_SCENE.CLEANING,
              "roborock-floor--return": scene === ROBOROCK_SCENE.RETURNING,
            })}
            aria-hidden="true"
          >
            <div className="roborock-grid" />
          </div>
        )}
        {scene === ROBOROCK_SCENE.CHARGING && (
          <div className="roborock-rings" aria-hidden="true">
            <span />
            <span />
          </div>
        )}
        <div className="roborock-mover">
          <img
            className="roborock-photo"
            src={away ? robotPhoto : dockPhoto}
            alt=""
          />
        </div>
      </div>
      <p className="roborock-status">{status}</p>
    </div>
  );
};
