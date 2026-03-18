import { defineConfig } from '@tutorialkit-rb/theme';

export default defineConfig({
  theme: {
    colors: {
      accent: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
        950: '#172554',
      },
    },
  },
  // required for TutorialKit monorepo development mode
  content: {
    pipeline: {
      include: '**',
    },
  },
});
