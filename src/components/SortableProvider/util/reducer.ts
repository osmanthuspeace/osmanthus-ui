import { Direction, Id } from "../../../type";
import { DraggingState } from "../../Draggable/interface";

export type DragAction =
  | {
      type: "DragStart";
      payload: { activeIndex: number; activeContainerId: Id };
    }
  | {
      type: "Dragging";
      payload: { overIndex: number; overContainerId: Id; direction: Direction };
    }
  | { type: "DragEnd"; payload: null };

export const initialDraggingState: DraggingState = {
  activeIndex: null,
  activeContainerId: null,
  overIndex: null,
  overContainerId: null,
  direction: null,
};

export const dragReducer = (state: DraggingState, action: DragAction) => {
  switch (action.type) {
    case "DragStart":
      return {
        ...state,
        activeIndex: action.payload.activeIndex,
        activeContainerId: action.payload.activeContainerId,
      };
    case "Dragging":
      return {
        ...state,
        overIndex: action.payload.overIndex,
        overContainerId: action.payload.overContainerId,
        direction: action.payload.direction,
      };
    case "DragEnd":
      return initialDraggingState;
    default:
      return state;
  }
};
