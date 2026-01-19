import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LiarsBarDapp } from "../target/types/liars_bar_dapp";
import {
  ComputeBudgetProgram,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";

describe("liars-bars", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const tableId = new anchor.BN(20);

  const program = anchor.workspace.LiarsBarDapp as Program<LiarsBarDapp>;

  // You need to know the IncoLightning program ID
  const INCO_LIGHTNING_PROGRAM_ID = new PublicKey(
    "5sjEbPiqgZrYwR31ahR6Uk9wf5awoX61YGg7jExQSwaj",
  );

  before("initializing-event-listner", async () => {
    program.addEventListener("liarsTableCreated", (event, slot, signature) => {
      console.log("liarsTableCreated event:", event.tableId.toNumber());
      // console.log("tx:", signature);
      // console.log("slots :", slot);
    });

    program.addEventListener("playerJoined", (event, slot, signature) => {
      console.log("playerJoined", event);
      console.log(event.player.toString());
      console.log(event.tableId.toNumber());
    });

    program.addEventListener("cardPlaced", (event, slot, signature) => {
      console.log("cardPlaced", event);
      console.log(event.player.toString());
      console.log(event.tableId.toNumber());
    });

    program.addEventListener("roundStarted", (event, slot, signature) => {
      console.log("roundStarted", event);
      // console.log(event..toString());
      console.log(event.tableId.toNumber());
    });

    program.addEventListener(
      "suffleCardsForPlayer",
      (event, slot, signature) => {
        console.log("suffleCardsForPlayer", event);
        console.log(event.player.toString());
        console.log(event.tableId.toNumber());
        console.log(event.next.toString());
      },
    );
  });

  it("create-table", async () => {
    const [tableAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("table"), tableId.toArrayLike(Buffer, "le", 8)],
      program.programId,
    );

    const tx = await program.methods
      .createTable(tableId)
      .accounts({
        signer: provider.wallet.publicKey,
        table: tableAddress,
        systemProgram: SystemProgram.programId,
        incoLightningProgram: INCO_LIGHTNING_PROGRAM_ID,
      } as any)
      .rpc();

    console.log("Tx:", tx);
  });

  it("join-table", async () => {
    const [tableAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("table"), tableId.toArrayLike(Buffer, "le", 8)],
      program.programId,
    );

    const [playerAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("player"),
        tableId.toArrayLike(Buffer, "le", 8),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId,
    );

    const tx = await program.methods
      .joinTable(tableId)
      .accounts({
        signer: provider.wallet.publicKey,
        table: tableAddress,
        player: playerAddress,
        systemProgram: SystemProgram.programId,
        incoLightningProgram: INCO_LIGHTNING_PROGRAM_ID,
      } as any)
      .rpc();

    console.log("Tx:", tx);

    // const table = await program.account.gameTable.fetch(tableAddress);

    // console.log(table);

    // const player = await program.account.player.fetch(playerAddress);

    // console.log(player);
  });

  it("start round", async () => {
    const [tableAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("table"), tableId.toArrayLike(Buffer, "le", 8)],
      program.programId,
    );
    const tx = await program.methods
      .startRound(tableId)
      .accounts({
        signer: provider.wallet.publicKey,
        table: tableAddress,
        // player: playerAddress,
        systemProgram: SystemProgram.programId,
        incoLightningProgram: INCO_LIGHTNING_PROGRAM_ID,
      } as any)
      .rpc();

    console.log("Tx:", tx);
  });

  it("suffle cards", async () => {
    const [tableAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("table"), tableId.toArrayLike(Buffer, "le", 8)],
      program.programId,
    );

    const [playerAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("player"),
        tableId.toArrayLike(Buffer, "le", 8),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId,
    );

    const tx = await program.methods
      .suffleCards(tableId)
      .accounts({
        signer: provider.wallet.publicKey,
        table: tableAddress,
        player: playerAddress,
        systemProgram: SystemProgram.programId,
        incoLightningProgram: INCO_LIGHTNING_PROGRAM_ID,
      } as any)
      .rpc();

    console.log("Tx:", tx);
  });

  it("place cards", async () => {
    const [tableAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("table"), tableId.toArrayLike(Buffer, "le", 8)],
      program.programId,
    );

    const [playerAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("player"),
        tableId.toArrayLike(Buffer, "le", 8),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId,
    );

    const tx = await program.methods
      .placeCards(tableId, Buffer.from([4, 2]))
      .accounts({
        signer: provider.wallet.publicKey,
        table: tableAddress,
        player: playerAddress,
        systemProgram: SystemProgram.programId,
        incoLightningProgram: INCO_LIGHTNING_PROGRAM_ID,
      } as any)
      .rpc();

    console.log("Tx:", tx);

    // const table = await program.account.gameTable.fetch(tableAddress);

    // console.log(table);

    // const player = await program.account.player.fetch(playerAddress);

    // console.log(player);
  });
});
