import Link from "next/link";
import { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";
import packageJson from "../../package.json";

export function Footer() {
  return (
    <section className="mt-12 flex flex-row justify-center">
      <SourceLink>
        {packageJson.name} {packageJson.version}
      </SourceLink>
    </section>
  );
}

export function SourceLink({ children }: { children?: ReactNode }) {
  return (
    <Link
      href="https://github.com/rvdende/surrealreact"
      target="_blank"
      className="self-center"
    >
      <button className="self-center">
        <FaGithub className="icon" />
      </button>
    </Link>
  );
}
