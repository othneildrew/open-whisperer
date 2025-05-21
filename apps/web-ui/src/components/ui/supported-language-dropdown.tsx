import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/shad-ui/dropdown-menu';
import { Language } from '@open-whisperer/rtk-query';
import { Button } from '@/components/shad-ui/button';
import { ChevronDown } from 'lucide-react';
import { useCallback, useMemo } from 'react';

export type SupportedLanguageCode = Language['code'];

export interface SupportedLanguageDropdownProps {
  languages: Language[];
  helperText: string;
  onChange: (language: SupportedLanguageCode) => void;
  value: SupportedLanguageCode | undefined;
  isLoading?: boolean;
  omittedLanguages?: SupportedLanguageCode[];
  allowAutoDetectOption?: boolean;
}

export const AUTO_LANGUAGE_SELECTION = {
  code: 'auto-detected',
  name: '(Auto Detect)',
};

export const SupportedLanguageDropdown = ({
  languages,
  helperText,
  onChange,
  isLoading,
  value,
  allowAutoDetectOption = false,
  omittedLanguages = [],
}: SupportedLanguageDropdownProps) => {
  const languagesWithAuto = useMemo(
    () => [
      ...(allowAutoDetectOption ? [AUTO_LANGUAGE_SELECTION] : []),
      ...languages,
    ],
    [allowAutoDetectOption, languages]
  );

  const filteredLanguages = useMemo(
    () => languagesWithAuto.filter((l) => !omittedLanguages.includes(l.code)),
    [languagesWithAuto, omittedLanguages]
  );

  const getLangOrUndefined = useCallback(
    (value?: SupportedLanguageCode) =>
      languagesWithAuto.find((o) => o.code === value),
    [languagesWithAuto]
  );

  const selected = useMemo(() => {
    const obj = getLangOrUndefined(value);
    return obj || { code: 'none', name: 'None' };
  }, [getLangOrUndefined, value]);

  const handleChange = useCallback(
    (value: SupportedLanguageCode) => {
      onChange?.(value);
    },
    [onChange]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          <small className="text-muted-foreground">{helperText}:</small>
          {selected?.name}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={selected?.code}
          onValueChange={handleChange}
        >
          <DropdownMenuRadioItem value="none" disabled>
            None
          </DropdownMenuRadioItem>
          {filteredLanguages.map(({ code, name }) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
