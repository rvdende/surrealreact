import {
  disconnectSurreal,
  getSurreal,
  useAppState,
} from "../../state/useAppState";
import { unique } from "moderndash";
import { SelectStyled } from "../SelectStyled";

export function CredentialsList() {
  const appstate = useAppState();

  const options = unique(
    appstate.credentialsList.map((c) => ({ name: c.hostname })),
    (a, b) => a.name === b.name
  );

  let current = { name: "" };

  if (
    appstate.credentialsList.filter(
      (i) => i.hostname === appstate.credentials.hostname
    ).length > 0
  ) {
    current = { name: appstate.credentials.hostname };
  }

  if (options.length === 0) return null;

  return (
    <SelectStyled
      value={current}
      options={options}
      onChange={(data) => {
        const credentials = appstate.credentialsList.find(
          (i) => i.hostname === data.name
        );
        console.log(credentials);
        appstate.set({
          credentials,
          info_kv: null,
          info_db: [],
          info_ns: [],
          info_tb: [],
        });
        disconnectSurreal({ silent: true });
        getSurreal();
        appstate.update().catch(console.error);
      }}
      onDelete={(data) => {
        console.log(data);
        const credentialsList = structuredClone(
          appstate.credentialsList
        ).filter((i) => i.hostname !== data.name);
        appstate.set({ credentialsList });
        console.log(credentialsList);
      }}
    />
  );
}

// const people = [
//   { name: "Wade Cooper" },
//   { name: "Arlene Mccoy" },
//   { name: "Devon Webb" },
//   { name: "Tom Cook" },
//   { name: "Tanya Fox" },
//   { name: "Hellen Schmidt" },
// ];
