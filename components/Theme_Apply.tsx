import { cookies } from 'next/headers';

export default async function get_theme() {
    try{
        const cookie = await cookies();
    if (cookie.get('theme')?.value == 'dark') {

        return ('dark');
    }
    else {
        return ('light');
    }

    }
    catch (e){
        return ('light');
    }
    
}

