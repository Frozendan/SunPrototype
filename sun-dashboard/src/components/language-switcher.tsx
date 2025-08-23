import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-context';
import { useLanguage } from '@/hooks/use-settings';
import { AVAILABLE_LANGUAGES, LANGUAGE_NAMES } from '@/lib/i18n';
import type { Language } from '@/types/i18n';

/**
 * Language switcher component with dropdown interface
 */
export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (selectedLanguage: Language) => {
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
    }
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          className="min-w-unit-16 h-unit-8 px-2"
          aria-label={t('components.languageSwitcher.selectLanguage')}
        >
          <motion.div
            key={language}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm font-medium">
              {language.toUpperCase()}
            </span>
            <svg
              className="w-4 h-4 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
          </motion.div>
        </Button>
      </DropdownTrigger>
      
      <DropdownMenu
        aria-label={t('components.languageSwitcher.selectLanguage')}
        selectedKeys={[language]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as Language;
          if (selectedKey) {
            handleLanguageChange(selectedKey);
          }
        }}
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <DropdownItem
            key={lang}
            className="flex items-center gap-3"
            textValue={LANGUAGE_NAMES[lang]}
          >
            <motion.div
              className="flex items-center gap-3 w-full"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.1 }}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {LANGUAGE_NAMES[lang]}
                </span>
                <span className="text-xs text-default-500">
                  {lang === 'vi' 
                    ? t('components.languageSwitcher.vietnamese')
                    : t('components.languageSwitcher.english')
                  }
                </span>
              </div>
              {language === lang && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

/**
 * Compact language switcher for mobile or space-constrained areas
 */
export function CompactLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const nextLanguage = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLanguage);
  };

  return (
    <Button
      variant="light"
      size="sm"
      onPress={toggleLanguage}
      className="min-w-unit-12 h-unit-8 px-2"
      aria-label={`Switch to ${language === 'vi' ? 'English' : 'Vietnamese'}`}
    >
      <motion.span
        key={language}
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.3 }}
        className="text-sm font-bold"
      >
        {language.toUpperCase()}
      </motion.span>
    </Button>
  );
}

/**
 * Language switcher with flags (if you want to add flag icons later)
 */
export function LanguageSwitcherWithFlags() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const languageConfig = {
    vi: {
      name: LANGUAGE_NAMES.vi,
      flag: '🇻🇳',
      code: 'VI',
    },
    en: {
      name: LANGUAGE_NAMES.en,
      flag: '🇺🇸',
      code: 'EN',
    },
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          className="min-w-unit-20 h-unit-8 px-3"
          aria-label={t('components.languageSwitcher.selectLanguage')}
        >
          <motion.div
            key={language}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <span className="text-lg">
              {languageConfig[language].flag}
            </span>
            <span className="text-sm font-medium">
              {languageConfig[language].code}
            </span>
          </motion.div>
        </Button>
      </DropdownTrigger>
      
      <DropdownMenu
        aria-label={t('components.languageSwitcher.selectLanguage')}
        selectedKeys={[language]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as Language;
          if (selectedKey) {
            setLanguage(selectedKey);
          }
        }}
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <DropdownItem
            key={lang}
            className="flex items-center gap-3"
            textValue={languageConfig[lang].name}
          >
            <motion.div
              className="flex items-center gap-3 w-full"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.1 }}
            >
              <span className="text-lg">
                {languageConfig[lang].flag}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {languageConfig[lang].name}
                </span>
                <span className="text-xs text-default-500">
                  {languageConfig[lang].code}
                </span>
              </div>
              {language === lang && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
