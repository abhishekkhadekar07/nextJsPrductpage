import { promises as fs } from 'fs';
import path from 'path';
import { normalizeUsername, type AuthUser, validateSignupInput } from './auth';

type StoredUser = {
  username: string;
  password: string;
};

type RegisterUserSuccess = {
  success: true;
  user: AuthUser;
};

type RegisterUserFailure = {
  success: false;
  code: 'validation' | 'exists';
  message: string;
};

type RegisterUserResult = RegisterUserSuccess | RegisterUserFailure;

const USERS_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(USERS_DIR, 'users.json');

async function ensureUsersFile() {
  await fs.mkdir(USERS_DIR, { recursive: true });

  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, '[]', 'utf8');
  }
}

function sanitizeUsers(raw: unknown): StoredUser[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const users: StoredUser[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const username = normalizeUsername(String((item as { username?: unknown }).username ?? ''));
    const password = String((item as { password?: unknown }).password ?? '');

    if (!username || !password || seen.has(username)) continue;
    seen.add(username);
    users.push({ username, password });
  }

  return users;
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureUsersFile();

  try {
    const file = await fs.readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(file) as unknown;
    return sanitizeUsers(parsed);
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await ensureUsersFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername || !password) return false;

  const users = await readUsers();
  const user = users.find((entry) => entry.username === normalizedUsername);
  return Boolean(user && user.password === password);
}

export async function registerUser(username: string, password: string): Promise<RegisterUserResult> {
  const validation = validateSignupInput(username, password);
  if (!validation.valid) {
    return {
      success: false,
      code: 'validation',
      message: validation.message,
    };
  }

  const users = await readUsers();

  if (users.some((entry) => entry.username === validation.username)) {
    return {
      success: false,
      code: 'exists',
      message: 'Username already exists',
    };
  }

  users.push({
    username: validation.username,
    password,
  });

  await writeUsers(users);

  return {
    success: true,
    user: { username: validation.username },
  };
}
