import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
    birthDate: string;

    @IsString()
    @IsNotEmpty({ message: 'Giờ sinh không được để trống' })
    birthTime: string;

    @IsString()
    @IsNotEmpty({ message: 'Nơi sinh không được để trống' })
    birthPlace: string;

    @IsString()
    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    gender: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;
}
