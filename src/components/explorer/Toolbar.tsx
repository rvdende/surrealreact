import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { authtype_calc, useAppState } from "../../state/useAppState";

export function Toolbar() {
  const appstate = useAppState();

  return (
    <section
      id="toolbar"
      className="panel mx-4 rounded-t-none border-t-0 p-0 px-2 pt-2 "
    >
      <button
        className="self-center"
        onClick={() => {
          appstate.set({ treeHidden: !appstate.treeHidden });
        }}
      >
        {appstate.treeHidden ? (
          <FaChevronRight className="icon" />
        ) : (
          <FaChevronLeft className="icon" />
        )}
      </button>

      <button
        onClick={() => {
          appstate.update().catch(console.error);
        }}
      >
        <IoMdRefresh className="icon" />
      </button>

      <div className="flex-1" />
    </section>
  );
}
