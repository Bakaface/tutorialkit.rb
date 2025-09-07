import { Nav } from '@tutorialkit-rb/react';
import type { Lesson, NavList } from '@tutorialkit-rb/types';

interface Props {
  lesson: Lesson;
  navList: NavList;
}

export function NavWrapper(props: Props) {
  return <Nav {...props} />;
}
