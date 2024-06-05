import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      "Erro ao obter dados de usuários " + error.message,
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({
        message: "Novo usuário criado com sucesso",
        user: newUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Erro ao criar novo usuário " + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;
    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({
          message: "Id ou nome de usuário não encontrados",
        }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Id do usuário inválido",
        }),
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          message: "Usuário não encontrado",
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Usuário atualizado com sucesso",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Erro ao atualizar usuário " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = await new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          message: "Id não encontrado",
        }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Id do usuário inválido",
        }),
        { status: 400 }
      );
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({
          message: "Usuário não encontrado",
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Usuário deletado com sucesso",
        user: deletedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Erro ao deletar usuário " + error.message, {
      status: 500,
    });
  }
};
