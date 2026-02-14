import { NextResponse } from 'next/server';


// GET - Fetch all products
const stocks =  [
        {
            name: 'HDFC',
            BUY: 922
        },
        {
            name: 'CONCOR',
            BUY: 511
        },
        {
            name:'NIFTYBEES',
            BUY:293
        },

]
export async function GET(request: Request) {
  try {
    console.log('request for stocks url', request);
    const result = stocks;
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch products',
        error: String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('request post for stocks url', request);
    const body = await request.json();
    console.log('Body',body);
 
    if (
      !body ||
      typeof body.name !== 'string' ||
      (typeof body.BUY !== 'number' && typeof body.BUY !== 'string')
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload. Expect { name: string, BUY: number }' },
        { status: 400 }
      );
    }

    const buyValue = typeof body.BUY === 'number' ? body.BUY : Number(body.BUY);
    if (Number.isNaN(buyValue)) {
      return NextResponse.json(
        { success: false, message: 'BUY must be a number' },
        { status: 400 }
      );
    }

    const newStock = { name: body.name, BUY: buyValue };
    stocks.push(newStock);

    return NextResponse.json({ success: true, stock: newStock, stocks }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch products',
        error: String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('request delete for stocks url', request);
    const body = await request.json();
    console.log('Body delete', body);

    if (!body || typeof body.name !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload. Expect { name: string }' },
        { status: 400 }
      );
    }

    const index = stocks.findIndex(
      (stock) => stock.name.toLowerCase() === body.name.toLowerCase()
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Stock not found' },
        { status: 404 }
      );
    }

    const deletedStock = stocks.splice(index, 1);

    return NextResponse.json(
      {
        success: true,
        message: 'Stock deleted successfully',
        deletedStock: deletedStock[0],
        stocks,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete stock',
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    console.log('request put for stocks url', request);
    const body = await request.json();
    console.log('Body put', body);

    if (
      !body ||
      typeof body.name !== 'string' ||
      (typeof body.BUY !== 'number' && typeof body.BUY !== 'string')
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload. Expect { name: string, BUY: number }' },
        { status: 400 }
      );
    }

    const buyValue = typeof body.BUY === 'number' ? body.BUY : Number(body.BUY);

    if (Number.isNaN(buyValue)) {
      return NextResponse.json(
        { success: false, message: 'BUY must be a number' },
        { status: 400 }
      );
    }

    const stock = stocks.find(
      (s) => s.name.toLowerCase() === body.name.toLowerCase()
    );

    if (!stock) {
      return NextResponse.json(
        { success: false, message: 'Stock not found' },
        { status: 404 }
      );
    }

    // ✅ Update value
    stock.BUY = buyValue;

    return NextResponse.json(
      {
        success: true,
        message: 'Stock updated successfully',
        updatedStock: stock,
        stocks,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update stock',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
