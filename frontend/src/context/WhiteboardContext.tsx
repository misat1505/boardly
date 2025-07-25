"use client";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import useHandlePaste from "@/hooks/board/useHandlePaste";
import usePersistBoard from "@/hooks/board/usePersistBoard";
import { useWebsocket } from "@/hooks/board/useWebsocket";
import { Board } from "@/types/Board";
import { BoardMode } from "@/types/BoardMode";
import { Cursor } from "@/types/Cursor";
import {
  Blank,
  DisplayableShape,
  Handwrite,
  Image,
  Rectangle,
  Selection,
  Shape,
  Text,
  TShape,
} from "@/types/shapes";
import { User } from "@/types/User";
import { detectCollisions } from "@/utils/detectCollisions";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";

type WhiteboardContextProps = PropsWithChildren & { board: Board; user: User };

type Position = { x: number; y: number };

export type WhiteboardContextProvidedValues = {
  toggleMode: (mode: BoardMode) => void;
  mode: BoardMode;
  save: () => void;
  stageRef: React.RefObject<any>;
  width: number;
  height: number;
  scale: number;
  position: Position;
  handleWheel: (e: KonvaEventObject<WheelEvent, Node<NodeConfig>>) => void;
  handleMouseDown: () => void;
  handleMouseMove: () => void;
  handleMouseUp: () => void;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  handleShapeDragEnd: (e: KonvaEventObject<DragEvent>, id: string) => void;
  shapes: Shape[];
  addShape: (shape: Shape) => void;
  handleSelectShape: (id: Shape["id"]) => void;
  clearShapeSelection: () => void;
  selectedShapeId: Shape["id"] | null;
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  groupSelectionShapes: Shape["id"][];
  setGroupSelectionShapes: Dispatch<SetStateAction<Shape["id"][]>>;
  onDragMove: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
  appendToGroupSelectionOnClick: (
    shape: Shape
  ) => (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
  removeFromGroupSelectionOnClick: (
    shape: Shape
  ) => (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
  board: Board;
  user: User;
};

const WhiteboardContext = createContext<
  WhiteboardContextProvidedValues | undefined
>(undefined);

export const useWhiteboardContext = () => {
  const context = useContext(WhiteboardContext);
  if (context === undefined)
    throw new Error("useWhiteboardContext called outside WhiteboardProvider.");
  return context;
};

const WhiteboardProvider = ({
  children,
  board,
  user,
}: WhiteboardContextProps) => {
  const [color] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.COLOR.name,
    LOCAL_STORAGE_KEYS.COLOR.defaultValue
  );
  const [brushSize] = useLocalStorage<number>(
    LOCAL_STORAGE_KEYS.BRUSH_SIZE.name,
    LOCAL_STORAGE_KEYS.BRUSH_SIZE.defaultValue
  );
  const [textSize] = useLocalStorage<number>(
    LOCAL_STORAGE_KEYS.TEXT_SIZE.name,
    LOCAL_STORAGE_KEYS.TEXT_SIZE.defaultValue
  );
  const [groupSelectionShapes, setGroupSelectionShapes] = useState<
    Shape["id"][]
  >([]);
  const [selectedShapeId, setSelectedShapeId] = useState<Shape["id"] | null>(
    null
  );
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [mode, setMode] = useState<BoardMode>(BoardMode.MOVING);
  const isDrawing = useRef(false);

  const { sendBoard } = useWebsocket(board.id, (newData) => {
    const socketShapes = JSON.parse(newData) as TShape[];

    const parsedShapes = socketShapes.map((shape) => {
      if (shape.type === "blank") return new Blank({ ...shape });
      else if (shape.type === "handwrite") return new Handwrite({ ...shape });
      else if (shape.type === "rect") return new Rectangle({ ...shape });
      else if (shape.type === "selection") return new Selection({ ...shape });
      else if (shape.type === "image") return new Image({ ...shape });
      else return new Text({ ...shape });
    });

    setShapes((prev) => [
      ...parsedShapes.filter((shape) => !prev.some((s) => s.id === shape.id)),
      ...prev,
    ]);
  });

  const stageRef = useRef<any>(null);

  const usePersistBoardValues = usePersistBoard({
    shapes,
    stageRef,
    board,
    sendBoard,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const savedShapes = [
        ...shapes.filter(
          (s) => !(s instanceof Blank) && !(s instanceof Selection)
        ),
        new Blank({ id: `blank_${Date.now()}` }),
      ].map((s) => s.jsonify());

      console.log("sending", JSON.stringify(savedShapes, null, 2));

      sendBoard(JSON.stringify(savedShapes));
    }, 5 * 1000);

    return () => clearInterval(intervalId);
  }, [shapes]);

  const getTransformedPointer = () => {
    const stage = stageRef.current;
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    return transform.point(pos);
  };

  useHandlePaste({ board, getTransformedPointer, setShapes });

  function loadBoard(json: Board["content"]) {
    if (json) {
      try {
        const data = JSON.parse(json) as TShape[];
        if (data) {
          const parsedShapes = data.map((shape) => {
            if (shape.type === "blank") return new Blank({ ...shape });
            else if (shape.type === "handwrite")
              return new Handwrite({ ...shape });
            else if (shape.type === "rect") return new Rectangle({ ...shape });
            else if (shape.type === "selection")
              return new Selection({ ...shape });
            else if (shape.type === "image") return new Image({ ...shape });
            else return new Text({ ...shape });
          });
          setShapes(parsedShapes);
        }
      } catch (err) {
        console.error("Failed to parse saved board", err);
      }
    }
  }

  useEffect(() => {
    loadBoard(board.content);
  }, []);

  const handleMouseDown = () => {
    if (mode === BoardMode.MOVING) {
      document.body.style.cursor = Cursor.GRABBING;
      return;
    }

    if (mode === BoardMode.CREATING_RECTANGLE) {
      const point = getTransformedPointer();
      setShapes((prev) => [
        ...prev,
        new Rectangle({
          id: `rect_${Date.now()}`,
          x: point.x,
          y: point.y,
          width: 0,
          height: 0,
          color,
        }),
      ]);
      return;
    }

    if (
      mode === BoardMode.USING_SELECTION_TOOL ||
      mode === BoardMode.CREATING_TEXTAREA
    ) {
      const point = getTransformedPointer();
      setShapes((prev) => [
        ...prev,
        new Selection({
          id: `selection_${Date.now()}`,
          x: point.x,
          y: point.y,
          width: 0,
          height: 0,
        }),
      ]);
      return;
    }

    isDrawing.current = true;
    const point = getTransformedPointer();
    setShapes((prev) => [
      ...prev,
      new Handwrite({
        id: `handwrite_${Date.now()}`,
        points: [point.x, point.y],
        x: 0,
        y: 0,
        color: color,
        width: brushSize,
      }),
    ]);
  };

  const handleMouseMove = () => {
    if (
      !isDrawing.current &&
      mode !== BoardMode.CREATING_RECTANGLE &&
      mode !== BoardMode.USING_SELECTION_TOOL &&
      mode !== BoardMode.CREATING_TEXTAREA
    )
      return;
    const point = getTransformedPointer();

    setShapes((prev) => {
      const lastShape = prev[prev.length - 1];
      if (!lastShape) return prev;

      if (lastShape instanceof Rectangle || lastShape instanceof Selection) {
        lastShape.height = point.y - lastShape.y;
        lastShape.width = point.x - lastShape.x;
        return [...prev];
      }

      if (lastShape instanceof Handwrite) {
        lastShape.points = [...lastShape.points, point.x, point.y];
        return [...prev];
      }

      return prev;
    });
  };

  const handleMouseUp = () => {
    setShapes((prev) => [
      ...prev,
      new Blank({
        id: `blank_${Date.now()}`,
      }),
    ]);
    isDrawing.current = false;
    if (
      ![
        BoardMode.CREATING_RECTANGLE,
        BoardMode.DRAWING,
        BoardMode.USING_SELECTION_TOOL,
        BoardMode.CREATING_TEXTAREA,
      ].includes(mode)
    )
      document.body.style.cursor = Cursor.GRAB;
    if (mode === BoardMode.USING_SELECTION_TOOL) {
      const selectionShapeId = shapes.findLastIndex(
        (s) => s instanceof Selection
      )!;
      const selectionShape = shapes[selectionShapeId];
      setShapes((prev) => prev.filter((s, id) => id < selectionShapeId));
      setGroupSelectionShapes(
        detectCollisions(shapes, selectionShape as any).map((s) => s.id)
      );
    } else if (mode === BoardMode.CREATING_TEXTAREA) {
      const selectionShapeId = shapes.findLastIndex(
        (s) => s instanceof Selection
      )!;
      const selectionShape = shapes[selectionShapeId] as Selection;
      const textNode = new Text({
        id: `text_${Date.now()}`,
        x: selectionShape.x,
        y: selectionShape.y,
        height: selectionShape.height,
        width: selectionShape.width,
        text: "",
        color: color,
        fontSize: textSize,
      });

      const filtered = shapes.filter((s) => !(s instanceof Selection));

      setShapes([...filtered, textNode]);

      setGroupSelectionShapes([]);
    }
  };

  const toggleMode = (mode: BoardMode) => {
    isDrawing.current = false;
    setMode(mode);
  };

  const width = typeof window !== "undefined" ? window.innerWidth : 800;
  const height = typeof window !== "undefined" ? window.innerHeight : 600;

  function handleWheel(e: KonvaEventObject<WheelEvent, Node<NodeConfig>>) {
    e.evt.preventDefault();

    const scaleBy = 0.95;
    const stage = stageRef.current;
    const oldScale = scale;

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);
  }

  const handleShapeDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    const { x, y } = e.target.position();
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (!(shape instanceof DisplayableShape)) return shape;
        if (shape.id !== id) return shape;

        shape.x = x;
        shape.y = y;

        return shape;
      })
    );
  };

  const handleSelectShape = (id: Shape["id"]) => {
    setSelectedShapeId(id);
  };

  const clearShapeSelection = () => {
    setSelectedShapeId(null);
  };

  useEffect(() => {
    if (mode === BoardMode.DRAWING) {
      document.body.style.cursor = Cursor.CRAYON;
    } else if (mode === BoardMode.MOVING) {
      document.body.style.cursor = Cursor.GRAB;
    } else if (mode === BoardMode.CREATING_RECTANGLE) {
      document.body.style.cursor = Cursor.CROSSHAIR;
    } else if (mode === BoardMode.USING_SELECTION_TOOL) {
      document.body.style.cursor = Cursor.CROSSHAIR;
    } else if (mode === BoardMode.CREATING_TEXTAREA) {
      document.body.style.cursor = Cursor.CROSSHAIR;
    }

    return () => {
      document.body.style.cursor = Cursor.AUTO;
    };
  }, [mode]);

  const addShape = (shape: Shape) => {
    setShapes((prev) => [...prev, shape]);
  };

  const onDragMove = (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => {
    // it is selected but not in group
    if (groupSelectionShapes.length === 0) return;

    setShapes((prev) =>
      prev.map((shape) => {
        if (
          !groupSelectionShapes.includes(shape.id) ||
          !(shape instanceof DisplayableShape)
        )
          return shape;

        shape.x = shape.x + e.evt.movementX / scale;
        shape.y = shape.y + e.evt.movementY / scale;

        return shape;
      })
    );
  };

  const appendToGroupSelectionOnClick =
    (shape: Shape) => (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
      const isCtrlPressed = e.evt.ctrlKey || e.evt.metaKey;

      if (isCtrlPressed) {
        setGroupSelectionShapes((prev) => [...prev, shape.id]);
      }
    };

  const removeFromGroupSelectionOnClick =
    (shape: Shape) => (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
      const isCtrlPressed = e.evt.ctrlKey || e.evt.metaKey;

      if (isCtrlPressed) {
        setGroupSelectionShapes((prev) => prev.filter((id) => id !== shape.id));
      }
    };

  return (
    <WhiteboardContext.Provider
      value={{
        toggleMode,
        mode,
        stageRef,
        width,
        height,
        scale,
        position,
        handleWheel,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        setPosition,
        handleShapeDragEnd,
        shapes,
        addShape,
        handleSelectShape,
        clearShapeSelection,
        selectedShapeId,
        setShapes,
        groupSelectionShapes,
        setGroupSelectionShapes,
        appendToGroupSelectionOnClick,
        onDragMove,
        removeFromGroupSelectionOnClick,
        board,
        user,
        ...usePersistBoardValues,
      }}
    >
      {children}
    </WhiteboardContext.Provider>
  );
};

export default WhiteboardProvider;
