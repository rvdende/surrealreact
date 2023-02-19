import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import packageJson from "../../package.json";

export function Footer() {
  return (
    <section className="mt-12 flex flex-row justify-center">
      <SourceLink />
    </section>
  );
}

export function SourceLink() {
  return (
    <Link
      href="https://github.com/rvdende/surrealreact"
      target="_blank"
      className="self-center"
    >
      <button className="gap-2 self-center">
        <FaGithub className="icon" />
        <span className="self-center">{packageJson.version}</span>
      </button>
    </Link>
  );
}
