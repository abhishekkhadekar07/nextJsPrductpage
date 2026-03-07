import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cartReducer from '@/store/cartSlice';
import stocksReducer from '@/store/stocksSlice';
import postsReducer from '@/store/postsSlice';
import { mockRouter, setParams, setSearchParams } from './mocks/next';
import AddToCartButton from '@/app/components/AddToCartButton';
import AddToCartForm from '@/app/components/AddToCartForm';
import AddStockForm from '@/app/Stocks/AddStockForm';
import DeleteStockButton from '@/app/Stocks/DeleteStockButton';
import UpdateStockForm from '@/app/Stocks/UpdateStockForm';
import UpdateForm from '@/app/Stocks/[name]/edit/UpdateForm';
import AddProductForm from '@/app/components/AddProductForm';
import LoginForm from '@/app/login/LoginForm';
import SignupForm from '@/app/signup/SignupForm';
import CartPage from '@/app/cart/page';
import CheckoutPage from '@/app/checkout/page';
import PostsPage from '@/app/posts/page';
import PostPage from '@/app/posts/[postid]/page';
import StocksPage from '@/app/Stocks/page';
import EditStockPage from '@/app/Stocks/[name]/edit/page';
import Navbar from '@/app/components/Navbar';
import ReduxProvider from '@/app/providers/ReduxProvider';
import SafeImage from '@/app/components/SafeImage';

function renderWithStore(ui: React.ReactElement, preloadedState?: Record<string, unknown>) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      stocks: stocksReducer,
      posts: postsReducer,
    },
    preloadedState: preloadedState as never,
  });

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}

describe('client components and pages', () => {
  it('AddToCartButton adds an item and shows feedback', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <AddToCartButton product={{ id: 5, title: 'Watch', price: 129.5, image: 'img' }} />
    );

    await user.click(screen.getByRole('button', { name: /add watch to cart/i }));
    expect(store.getState().cart.items).toHaveLength(1);
    expect(screen.getByText('Added to cart')).toBeInTheDocument();
  });

  it('AddToCartForm respects quantity while adding item', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<AddToCartForm product={{ id: 8, title: 'Phone', price: 100 }} />);

    const qtyInput = screen.getByLabelText('Quantity');
    fireEvent.change(qtyInput, { target: { value: '3' } });
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(store.getState().cart.items[0]).toMatchObject({ id: 8, qty: 3 });
    expect(screen.getByText('Added 3 items to cart')).toBeInTheDocument();
  });

  it('AddStockForm validates input and dispatches valid stock', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<AddStockForm />);
    const [nameInput, buyInput] = screen.getAllByRole('textbox');

    await user.type(nameInput, 'abfrl');
    await user.type(buyInput, 'abc');
    await user.click(screen.getByRole('button', { name: /add stock/i }));
    expect(screen.getByText(/please provide a valid stock name/i)).toBeInTheDocument();

    fireEvent.change(buyInput, { target: { value: '345' } });
    await user.click(screen.getByRole('button', { name: /add stock/i }));

    expect(store.getState().stocks.items.some((item) => item.name === 'ABFRL')).toBe(true);
  });

  it('DeleteStockButton removes a stock', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<DeleteStockButton name="HDFC" />);

    const before = store.getState().stocks.items.length;
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(store.getState().stocks.items.length).toBe(before - 1);
  });

  it('UpdateStockForm updates stock value', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<UpdateStockForm name="HDFC" currentBUY={922} />);

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '1000');
    await user.click(screen.getByRole('button', { name: /update/i }));

    expect(store.getState().stocks.items.find((item) => item.name === 'HDFC')?.BUY).toBe(1000);
  });

  it('stocks edit UpdateForm dispatches update and navigates back', async () => {
    const user = userEvent.setup();
    renderWithStore(<UpdateForm stock={{ name: 'TCS', BUY: 4100 }} />);

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '4200');
    await user.click(screen.getByRole('button', { name: /update stock/i }));

    expect(mockRouter.push).toHaveBeenCalledWith('/Stocks');
  });

  it('AddProductForm shows validation errors for empty form submit', async () => {
    const user = userEvent.setup();
    render(<AddProductForm redirectTo="/products" />);

    await user.click(screen.getByRole('button', { name: /add product/i }));
    expect(screen.getByText(/please fix the errors below/i)).toBeInTheDocument();
  });

  it('LoginForm validates required credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm redirectTo="/products" />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
  });

  it('SignupForm validates password confirmation', async () => {
    const user = userEvent.setup();
    render(<SignupForm redirectTo="/products" />);

    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.type(screen.getByLabelText('Confirm Password'), 'secret124');
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('CartPage renders empty state', () => {
    renderWithStore(<CartPage />, { cart: { items: [] } });
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('CheckoutPage confirms order after place order click', async () => {
    vi.useFakeTimers();
    renderWithStore(<CheckoutPage />, {
      cart: { items: [{ id: 1, title: 'Bag', price: 50, qty: 1 }] },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /place order/i }));
      await vi.advanceTimersByTimeAsync(700);
    });
    expect(screen.getByText('Order confirmed')).toBeInTheDocument();
  });

  it('PostsPage filters by query and PostPage reads route param', () => {
    setSearchParams({ q: 'beta' });
    renderWithStore(<PostsPage />, {
      posts: {
        items: [
          { id: 1, title: 'Alpha title', body: 'Alpha body', userId: 1 },
          { id: 2, title: 'Beta title', body: 'Beta body', userId: 2 },
        ],
      },
    });
    expect(screen.getByText('Beta title')).toBeInTheDocument();
    expect(screen.queryByText('Alpha title')).not.toBeInTheDocument();

    setParams({ postid: '2' });
    renderWithStore(<PostPage />, {
      posts: {
        items: [{ id: 2, title: 'Beta title', body: 'Beta body', userId: 2 }],
      },
    });
    expect(screen.getAllByText('Beta title').length).toBeGreaterThan(0);
  });

  it('Stocks pages render hydrated/edit states', () => {
    renderWithStore(<StocksPage />, {
      stocks: { items: [{ name: 'TCS', BUY: 4100 }], hydrated: false },
    });
    expect(screen.getByText('Loading saved stocks...')).toBeInTheDocument();

    setParams({ name: 'TCS' });
    renderWithStore(<EditStockPage />, {
      stocks: { items: [{ name: 'TCS', BUY: 4100 }], hydrated: true },
    });
    expect(screen.getByText('Edit TCS')).toBeInTheDocument();
  });

  it('Navbar resolves auth state and ReduxProvider renders children', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      )
    );

    renderWithStore(<Navbar />);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    });

    render(
      <ReduxProvider>
        <div data-testid="child">child</div>
      </ReduxProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('SafeImage falls back when image load fails', () => {
    render(<SafeImage src="https://broken.example.com/a.png" alt="test-image" width={100} height={100} />);
    const image = screen.getByAltText('test-image');

    expect(image).toHaveAttribute('src', 'https://broken.example.com/a.png');
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/images/product-fallback.svg');
  });
});
