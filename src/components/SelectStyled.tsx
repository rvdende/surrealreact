import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { HiChevronUpDown, HiXMark } from "react-icons/hi2";

export function SelectStyled({
  value,
  options,
  onChange,
  onDelete,
}: {
  value: { name: string };
  options: { name: string }[];
  onChange: (value: { name: string }) => void;
  onDelete?: (value: { name: string }) => void;
}) {
  // const [selectedPerson, setSelectedPerson] = useState(people[0]);
  // const [selected, setSelected] = useState(people[0]);

  return (
    <div className="flex w-full flex-row gap-3">
      <Listbox
        value={value}
        onChange={(data) => {
          onChange(data);
        }}
      >
        <div className="relative flex-1">
          <Listbox.Button className="button relative w-full cursor-default  py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-pink-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-300 sm:text-sm">
            <span className="block flex-1 truncate">{value?.name ?? " "}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <HiChevronUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-600 py-1 font-bold shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 font-bold ${
                      active
                        ? "text-pink-300 hover:bg-purple-400/20"
                        : "text-zinc-300"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={` flex flex-row truncate font-bold ${
                          selected ? "text-white" : ""
                        }`}
                      >
                        {item.name}

                        <div className="flex-1" />
                        {onDelete && (
                          <button
                            className="m-0 rounded-full p-1"
                            onClick={(e) => {
                              e.preventDefault();
                              onDelete(item);
                            }}
                          >
                            <HiXMark className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
