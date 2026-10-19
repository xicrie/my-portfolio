import { describe, expect, it } from "vitest";
import { editorialTypography } from "../lib/editorialTypography";

describe("editorial punctuation without changing technical content", () => {
  it("formats punctuation in prose, including original article text", () => {
    const text = { type: "text", value: "Сценарий — пример за 2–4 недели" };
    editorialTypography()({ type: "root", children: [text] });
    expect(text.value).toBe("Сценарий: пример за 2-4 недели");
  });
  it("leaves code, inline identifiers and link destinations untouched", () => {
    const code = { type: "code", value: 'run("a—b")' };
    const inline = { type: "inlineCode", value: "value–id" };
    const link = { type: "link", url: "https://example.test/a—b", children: [{ type: "text", value: "Кейс — описание" }] };
    editorialTypography()({ type: "root", children: [code, inline, link] });
    expect(code.value).toBe('run("a—b")');
    expect(inline.value).toBe("value–id");
    expect(link.url).toBe("https://example.test/a—b");
    expect(link.children[0].value).toBe("Кейс: описание");
  });
});
