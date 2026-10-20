import { describe, expect, it } from "vitest";
import { editorialTypography, russianTypography } from "../lib/editorialTypography";

describe("editorial punctuation without changing technical content", () => {
  it("formats punctuation in prose, including original article text", () => {
    const text = { type: "text", value: "Сценарий — пример за 2–4 недели" };
    editorialTypography()({ type: "root", children: [text] });
    expect(text.value).toBe("Сценарий: пример за\u00a02-4 недели");
  });
  it("binds consecutive prepositions and conjunctions, including before inline content", () => {
    expect(russianTypography("И в Telegram, а также для команды"))
      .toBe("И\u00a0в\u00a0Telegram, а\u00a0также для\u00a0команды");
    const tree = {type: "root", children: [
      {type: "text", value: "Обсудить с "},
      {type: "strong", children: [{type: "text", value: "командой и клиентом"}]},
    ]};
    editorialTypography()(tree);
    expect(tree.children[0].value).toBe("Обсудить с\u00a0");
    expect(tree.children[1].children?.[0].value).toBe("командой и\u00a0клиентом");
    expect(russianTypography(russianTypography("И в Telegram"))).toBe(russianTypography("И в Telegram"));
  });
  it("does not duplicate outer quotation marks in an attributed blockquote", () => {
    const quote = {type: "text", value: "«Сервис для «своих» клиентов.»\nАвтор"};
    editorialTypography()({type: "blockquote", children: [quote]});
    expect(quote.value).toBe("Сервис для\u00a0«своих» клиентов.\nАвтор");
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
