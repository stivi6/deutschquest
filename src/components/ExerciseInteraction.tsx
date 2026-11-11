import { Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mechanic, Prompt } from "@/data/exercises";

const pictureLabels: Record<string, string> = {
  apple: "Mollë",
  book: "Libër",
  house: "Shtëpi",
  cat: "Katë",
  dog: "Këlysh",
  bread: "Buke",
  coffee: "Kafe",
  water: "Ujë",
  car: "Makinë",
  school: "Shkollë",
  train: "Tren",
  bus: "Autobus",
  bicycle: "Biçikletë",
  clock: "Sahat",
  sun: "Diell",
  tree: "Pemë",
  phone: "Telefon",
};

type Props = {
  prompt: Prompt;
  type: Mechanic;
  selected: string;
  setSelected: (s: string) => void;
  words: number[];
  setWords: (a: number[]) => void;
  matched: boolean;
  setMatched: (b: boolean) => void;
  checked: boolean;
};
export function ExerciseInteraction({
  prompt,
  type,
  selected,
  setSelected,
  words,
  setWords,
  matched,
  setMatched,
  checked,
}: Props) {
  if (type === "sentence")
    return (
      <>
        <div className="sentence-area" aria-label="Fjalia juaj">
          {words.length === 0 ? (
            <span className="sentence-placeholder">Fjalia juaj</span>
          ) : (
            words.map((index, i) => (
              <Button
                variant="secondary"
                size="quest"
                className="quest-button"
                key={`${index}-${i}`}
                disabled={checked}
                aria-label={`Hiq ${prompt.options[index]}`}
                onClick={() => {
                  const next = words.filter((_, n) => n !== i);
                  setWords(next);
                  setSelected(next.map((n) => prompt.options[n]).join(" "));
                }}
              >
                {prompt.options[index]}
              </Button>
            ))
          )}
        </div>
        <div className="word-chips">
          {prompt.options.map((word, index) => (
            <Button
              variant="outline"
              size="quest"
              className="quest-button"
              key={word}
              disabled={checked || words.includes(index)}
              onClick={() => {
                const next = [...words, index];
                setWords(next);
                setSelected(next.map((n) => prompt.options[n]).join(" "));
              }}
            >
              {word}
            </Button>
          ))}
        </div>
        <div className="undo-row">
          <Button
            variant="ghost"
            className="quest-button"
            aria-label="Anulo fjalën e fundit"
            disabled={checked || words.length === 0}
            onClick={() => {
              const next = words.slice(0, -1);
              setWords(next);
              setSelected(next.map((n) => prompt.options[n]).join(" "));
            }}
          >
            <Undo2 />
            Anulo
          </Button>
        </div>
      </>
    );
  return (
    <>
      {type === "match" && (
        <>
          <div className="match-source">
            <Button
              variant="outline"
              size="quest"
              className={`quest-button ${matched ? "selected" : ""}`}
              disabled={checked}
              aria-pressed={matched}
              onClick={() => setMatched(!matched)}
            >
              {prompt.question}
              {matched && <Check />}
            </Button>
          </div>
          <div className="match-line" />
        </>
      )}
      <div
        className={`answers-grid ${type === "picture" ? "pictures" : type === "number" ? "numbers" : type === "color" ? "colors" : prompt.options.some((o) => o.length > 25) ? "long-options" : ""}`}
      >
        {prompt.options.map((option, index) => {
          const chosen = selected === option;
          const correct = checked && option === prompt.answer;
          const wrong = checked && chosen && !correct;
          const pictureText = type === "picture" ? pictureLabels[option] ?? option : option;
          return (
            <Button
              variant="answer"
              className={`${chosen ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "incorrect" : ""} ${type === "picture" ? "picture-option" : type === "number" ? "numeric-option" : ""}`}
              key={option}
              aria-pressed={chosen}
              aria-label={option}
              disabled={checked || (type === "match" && !matched)}
              onClick={() => setSelected(option)}
            >
              {type === "picture" ? (
                <>
                  <img src={`/assets/vocabulary/${option}.svg`} alt="" width="76" height="76" />
                  <span>{pictureText}</span>
                </>
              ) : type === "number" ? (
                <span>{option}</span>
              ) : (
                <>
                  {type === "color" ? (
                    <span className={`swatch ${option}`} />
                  ) : (
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  )}
                  <span className="option-text">{option}</span>
                  {correct && <Check className="text-success" />}
                </>
              )}
            </Button>
          );
        })}
      </div>
    </>
  );
}
