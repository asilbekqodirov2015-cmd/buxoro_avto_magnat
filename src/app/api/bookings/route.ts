import { NextResponse } from 'next/server';
import { 
  getTestDrives, 
  saveTestDrive, 
  updateTestDriveStatus, 
  getTradeIns, 
  saveTradeIn, 
  updateTradeIn,
  getCreditApplications,
  saveCreditApplication,
  updateCreditApplicationStatus
} from '../../../lib/dbService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'test-drive', 'trade-in' or 'credit'
    
    if (type === 'trade-in') {
      const tradeIns = await getTradeIns();
      return NextResponse.json(tradeIns);
    }
    
    if (type === 'credit') {
      const credits = await getCreditApplications();
      return NextResponse.json(credits);
    }
    
    const testDrives = await getTestDrives();
    return NextResponse.json(testDrives);
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json({ error: 'Arizalarni yuklashda xatolik' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body; // 'create-test-drive', 'create-trade-in', 'create-credit', etc.
    
    if (action === 'create-test-drive') {
      const newTd = await saveTestDrive({
        carId: body.carId,
        name: body.name,
        phone: body.phone,
        date: new Date(body.date),
        notes: body.notes || ''
      });
      
      console.log(`[TELEGRAM NOTIFICATION] Yangi test-drayv arizasi: ${body.name} (${body.phone}). Sana: ${body.date}`);
      
      return NextResponse.json({ success: true, booking: newTd });
    }
    
    if (action === 'create-trade-in') {
      const newTi = await saveTradeIn({
        name: body.name,
        phone: body.phone,
        carBrand: body.carBrand,
        carModel: body.carModel,
        carYear: parseInt(body.carYear),
        mileage: parseInt(body.mileage),
        images: body.images || [],
        notes: body.notes || ''
      });

      console.log(`[TELEGRAM NOTIFICATION] Yangi Trade-In arizasi: ${body.name} (${body.phone}). Avto: ${body.carBrand} ${body.carModel}`);
      
      return NextResponse.json({ success: true, request: newTi });
    }

    if (action === 'create-credit') {
      const newCa = await saveCreditApplication({
        name: body.name,
        phone: body.phone,
        carId: body.carId,
        bankId: body.bankId,
        downPayment: body.downPayment,
        termMonths: parseInt(body.termMonths),
        monthlyPayment: body.monthlyPayment,
        status: 'PENDING'
      });

      console.log(`[TELEGRAM NOTIFICATION] Yangi Avtokredit arizasi: ${body.name} (${body.phone}). Avto ID: ${body.carId}`);

      return NextResponse.json({ success: true, request: newCa });
    }

    if (action === 'update-test-drive') {
      const updated = await updateTestDriveStatus(body.id, body.status, body.notes);
      return NextResponse.json({ success: true, booking: updated });
    }

    if (action === 'update-trade-in') {
      const updated = await updateTradeIn(body.id, body.status, body.estimatedPrice, body.notes);
      return NextResponse.json({ success: true, request: updated });
    }

    if (action === 'update-credit') {
      const updated = await updateCreditApplicationStatus(body.id, body.status, body.notes);
      return NextResponse.json({ success: true, request: updated });
    }

    return NextResponse.json({ error: 'Noma\'lum amal' }, { status: 400 });
  } catch (error) {
    console.error('Bookings POST error:', error);
    return NextResponse.json({ error: 'Amalni bajarishda xatolik' }, { status: 500 });
  }
}
