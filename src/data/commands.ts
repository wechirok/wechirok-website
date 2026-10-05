export const commands = [
  {
    name: 'help',
    icon: 'circle-help',
    action: 'reply',
  },
  {
    name: 'about',
    icon: 'user-round',
    action: 'reply',
  },
  {
    name: 'work',
    icon: 'briefcase-business',
    action: 'reply',
  },
  {
    name: 'projects',
    icon: 'folder-code',
    action: 'reply',
  },
  {
    name: 'links',
    icon: 'link',
    action: 'reply',
  },
  {
    name: 'clear',
    icon: 'trash-2',
    action: 'clear',
  },
] as const;

export type CommandName = (typeof commands)[number]['name'];

const registry = new Map<string, (typeof commands)[number]>(
  commands.map((command) => [command.name, command]),
);

export function findCommand(input: string) {
  return registry.get(input.trim().toLowerCase().replace(/\s+/g, ' '));
}
