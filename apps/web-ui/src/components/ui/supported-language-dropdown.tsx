import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/shad-ui/dropdown-menu";
import { Language } from "@open-whisperer/rtk-query";
import { Button } from "@/components/shad-ui/button";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type SupportedLanguageCode = Language["code"];

export interface SupportedLanguageDropdownProps {
  languages: Language[];
  helperText: string;
  defaultSelected?: SupportedLanguageCode;
  onChange?: (language: Language) => void;
  isLoading?: boolean;
}

export const SupportedLanguageDropdown = ({
  languages,
  helperText,
  onChange,
  defaultSelected,
  isLoading,
}: SupportedLanguageDropdownProps) => {
  const languagesWithAuto = useMemo(() => {
    return [{ code: "auto-detected", name: "(Auto Detect)" }, ...languages];
  }, [languages]);

  const getLangOrUndefined = useCallback(
    (value: SupportedLanguageCode) =>
      languagesWithAuto.find((o) => o.code === value),
    [languagesWithAuto],
  );

  const [selected, setSelected] = useState<Language>(
    () => languagesWithAuto[0],
  );

  const handleChange = (value: SupportedLanguageCode) => {
    const obj = getLangOrUndefined(value);
    if (obj) setSelected(obj);
  };

  useEffect(() => {
    onChange?.(selected);
  }, [onChange, selected]);

  useEffect(() => {
    if (defaultSelected) {
      const obj = getLangOrUndefined(defaultSelected);
      if (obj) setSelected(obj);
    }
  }, [defaultSelected, getLangOrUndefined]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          <small className="text-muted-foreground">{helperText}:</small>
          {selected.name}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={selected.code}
          onValueChange={handleChange}
        >
          {languagesWithAuto.map(({ code, name }) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
